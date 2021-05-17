/**
 * Make your magic here!
 */

(() => {
    'use strict'

    // Register service worker.
    if ("serviceWorker" in navigator) {
        const swPath = 'sw.js';

        navigator.serviceWorker.register(swPath)
            .then(res => { console.log('Service worker registered.') })
            .catch(res => { console.log('Can not find service worker.') })
    }

    const q = (selector, target) => (target || document).querySelector(selector);
    const qa = (selector, target) => (target || document).querySelectorAll(selector);

    const video = q('.video-ribbon video');

    if (video) {
        window.addEventListener('load', e => {
            // video.play();
        });
    }

})()