const CACHE_STATIC_NAME = 'nohaus-static-v1.0';
const CACHE_STATIC_FILES = [
    '/',
    'index.html',
    'configurador.html',
    'design/fonts/Gotham-Book.woff',
    'design/fonts/Gotham-Book.woff2',
    'design/fonts/Gotham-Light.woff',
    'design/fonts/Gotham-Light.woff2',
    'design/fonts/GothamMedium.woff',
    'design/fonts/GothamMedium.woff2',
    'design/fonts/MCMiltonRegular.woff',
    'design/fonts/MCMiltonRegular.woff2',
    'design/scripts/pl.js',
    'design/scripts/scripts.min.js',
    'design/styles/styles.css',
];

const CACHE_INMUTABLE_NAME = 'nohaus-inmutable-v1.0';
const CACHE_INMUTABLE_FILES = [
    'https://code.jquery.com/jquery-2.2.4.min.js',
    'https://unpkg.com/swiper/swiper-bundle.min.js',
    'https://unpkg.com/swiper/swiper-bundle.min.css',
    'design/scripts/vendor/jquery.stellar.min.js',
    'design/styles/vendor/bootstrap.min.css',
    'design/styles/vendor/bootstrap.min.css.map'
];

const CACHE_DYNAMIC_NAME = 'nohaus-dynamic-v1.0';

self.addEventListener('install', event => {
    const loadStatic = caches.open(CACHE_STATIC_NAME)
        .then(cache => cache.addAll(CACHE_STATIC_FILES));

    const loadInmutable = caches.open(CACHE_INMUTABLE_NAME)
        .then(cache => cache.addAll(CACHE_INMUTABLE_FILES));

    event.waitUntil(
        Promise.all([loadStatic, loadInmutable])
    );
});

self.addEventListener('activate', event => {
    const deleteOldCaches = caches.keys()
        .then(cacheNames => Promise.all(cacheNames.map(cacheName => {
            if (cacheName !== CACHE_STATIC_NAME && cacheName !== CACHE_INMUTABLE_NAME) {
                return caches.delete(cacheName);
            }
        })));

    event.waitUntil(
        deleteOldCaches
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_DYNAMIC_NAME)
                            .then(cache => cache.put(event.request, responseToCache))

                        return response;
                    })
            })
    );
});