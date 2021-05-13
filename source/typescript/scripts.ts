/**
 * Make your magic here!
 */

(() => {
    'use strict'

    // Register service worker.
    if ( "serviceWorker" in navigator ) {
        const swPath = 'sw.js';

        navigator.serviceWorker.register(swPath)
            .then( res => { console.log('Service worker registered.') } )
            .catch( res => { console.log('Can not find service worker.') } )
    }

})()