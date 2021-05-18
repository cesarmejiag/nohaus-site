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


    // Globals
    const navigation = q('.navigation');

    function changeNavColor() {
        if (window.scrollY > 100) {
            navigation.classList.add('inverted-color');
        } else {
            navigation.classList.remove('inverted-color');
        }
    }

    function expandMenu() {
        const list = q('.list-wrapper', navigation);
        list.classList.toggle('list-expanded');
        navigation.classList.toggle('list-visible');
    }
    
    // Navigation
    (() => {
        const toggleBtn = q('.toggle-btn', navigation);
        toggleBtn.addEventListener('click', expandMenu);

        changeNavColor();
    })();
    

    // Events
    window.addEventListener('resize', e => {
        changeNavColor();
    });

    window.addEventListener('scroll', e => {
        changeNavColor();
    });

})()