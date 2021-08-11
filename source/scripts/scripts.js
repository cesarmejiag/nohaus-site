/**
 * Make your magic here!
 */

// Register service worker.
if ("serviceWorker" in navigator) {
    const swPath = 'sw.js';

    navigator.serviceWorker.register(swPath)
        .then(res => { console.log('Service worker registered.') })
        .catch(res => { console.log('Can not find service worker.') })
}

const q = (selector, target) => (target || document).querySelector(selector);
const qa = (selector, target) => (target || document).querySelectorAll(selector);


// Globals
const navigation = q('.navigation');

function changeNavColor() {
    if (location.pathname === '/') {
        if (window.scrollY > 100) {
            navigation.classList.add('inverted-color');
        } else {
            navigation.classList.remove('inverted-color');
        }
    }
}

function expandMenu() {
    const list = q('.list-wrapper', navigation);
    list.classList.toggle('list-expanded');
    navigation.classList.toggle('list-visible');
}

// Navigation
(() => {
    const options = qa('.scroll-to', navigation)
    const toggleBtn = q('.toggle-btn', navigation);
    const scrollTo = (key) => {
        $('html, body').animate({
            scrollTop: $(key).offset().top - navigation.clientHeight
        }, 375);
    };

    const hasHash = () => {
        if (location.hash) {
            const key = location.hash.substring(location.hash.indexOf('#')).replace('/', '');
            scrollTo(key);
        }
    }

    [].forEach.call(options, option => {
        option.addEventListener('click', e => {
            e.preventDefault();
            const href = e.currentTarget.href
            const key = href.substring(href.indexOf('#')).replace('/', '');

            scrollTo(key);
        });
    });

    toggleBtn.addEventListener('click', expandMenu);
    changeNavColor();

    window.addEventListener('load', hasHash);
})();

// Contact Form
(() => {
    const formElement = q('.contact-form');

    if (!formElement) {
        return;
    }

    const settings = {
        url: 'ajax-request.php',
        useAjax: true,
        inputSelectors: [
            "input[type=text]",
            "input[type=checkbox]",
            "input[type=radio]",
            "select",
            "textarea"
        ]
    };

    const form = new pl.ContactForm(formElement, settings);
    const text = q('.message > div', formElement);

    const changeFormState = (state, message = '') => {
        text.innerText = message;
        formElement.classList.remove('error', 'success', 'loading');
        formElement.classList.add(state);
    }

    const removeMessage = () => {
        setTimeout(() => {
            text.innerText = '';
            formElement.classList.remove('error', 'success', 'loading');
        }, 3000);
    };


    // Notify when form is sending a message.
    form.sending.add(() => {
        changeFormState('loading', 'Enviando mensaje...');
    });

    // Notify if an error occured with the request. 
    form.error.add(() => {
        changeFormState('error', 'Hubo un error al enviar tu correo, inténtalo nuevamente.');
        removeMessage();
    });

    // Notify if the request was successfully resolved.
    form.success.add((response) => {
        if (response == 1) {
            changeFormState('success', 'Mensaje enviado');
            form.reset();
        } else {
            changeFormState('error', 'Hubo un error al enviar tu correo, inténtalo nuevamente.');
        }

        removeMessage();
    });
})();


// Initialize stellar.
$.stellar({
    // Set scrolling to be in either one or both directions
    horizontalScrolling: false,
    verticalScrolling: true,

    // Set the global alignment offsets
    horizontalOffset: 0,
    verticalOffset: 0,

    // Refreshes parallax content on window load and resize
    responsive: false,

    // Select which property is used to calculate scroll.
    // Choose 'scroll', 'position', 'margin' or 'transform',
    // or write your own 'scrollProperty' plugin.
    scrollProperty: 'scroll',

    // Select which property is used to position elements.
    // Choose between 'position' or 'transform',
    // or write your own 'positionProperty' plugin.
    positionProperty: 'position',

    // Enable or disable the two types of parallax
    parallaxBackgrounds: true,
    parallaxElements: true,

    // Hide parallax elements that move outside the viewport
    hideDistantElements: true,

    // Customise how elements are shown and hidden
    hideElement: function ($elem) { $elem.hide(); },
    showElement: function ($elem) { $elem.show(); }
});


// Initialize Swiper JS.
const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    autoplay: {
        delay: 5000
    },

    on: {
        init: function () {
            const carrusel = q('.block.us .carrousel');
            const pagination = q('.block.us .swiper-pagination');

            carrusel.appendChild(pagination);
        }
    }
});


// Events
window.addEventListener('resize', e => {
    changeNavColor();
});

window.addEventListener('scroll', e => {
    changeNavColor();
});