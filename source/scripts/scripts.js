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

    // Contact Form
    (() => {
        const settings = {
            url: 'ajax-request.php',
            useAjax: true
        };

        const formElement = q('.contact-form');
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

    // Events
    window.addEventListener('resize', e => {
        changeNavColor();
    });

    window.addEventListener('scroll', e => {
        changeNavColor();
    });

})()