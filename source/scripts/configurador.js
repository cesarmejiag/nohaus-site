const categoryImg = q('.configurator .image img');
const categoryBtns = q('.category-btns');
const categoryDesc = q('.category-desc');
const categoryOpts = q('.category-options');
const categoryWrapper = q('.category-wrapper');
const contactFormWrapper = q('.contact-form-wrapper');

const userSelection = {};

/**
 * Create new element.
 * @param {string} tagName 
 * @returns {HTMLElement}
 */
function createEl(tagName) {
    const parts = tagName.split('.');
    const tag = parts.shift();
    const el = document.createElement(tag);

    parts.forEach(part => el.classList.add(part));

    return el;
}

/**
 * Attach handler to an element when event occurs.
 * @param {string} events 
 * @param {HTMLElement} el 
 * @param {function} handler 
 */
function on(events, el, handler) {
    el.addEventListener(events, handler);
}

/**
 * Slugify a string.
 * @param {string} string
 * @returns {string}
 */
function slugify(string) {
    return string.toLowerCase().replace(/\s/g, '-');
}

/**
 * Active or desactive button.
 * @param {HTMLElement} button
 */
function activeButton(button) {
    const buttons = button.parentElement.children;

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i] === button) {
            buttons[i].classList.add('selected');
        } else {
            buttons[i].classList.remove('selected');
        }
    }
}

/**
 * Create buttons.
 * @param {object}
 * @param {HTMLElement} container
 * @param {function} handler
 */
function createButtons(data, container, handler) {
    container.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        const { name, desc, img = '' } = data[i];
        const button = createEl('button');

        button.innerHTML = name;
        button.id = i;
        button.key = name;

        container.appendChild(button);
        on('click', button, () => typeof handler === 'function' ? handler(button, name, desc, img) : undefined);

        i == 0 && button.click();
    }
}

/**
 * Create form controls.
 * @param {string} oName
 * @param {object[]} options
 * @returns {string}
 */
function createControls(oName, options) {
    let controls = '';

    for (let i = 0; i < options.length; i++) {
        const { name, desc } = options[i];
        const id = slugify(`${oName}-${name}`);
        const iName = slugify(oName);
        const type = (oName === 'Batea' || oName === 'Colores') ? 'radio' : 'checkbox';

        if (oName === 'Colores') {
            controls += `
                <label class="option-control control-${type} control-${iName}" for="${id}">
                    <input id="${id}" class="hide" name="${iName}" type="${type}" value="${name}" />
                    <div class="control"></div>
                    <div class="text">
                        <div>${name}</div>
                        <div style="background-color: ${desc}"></div>
                    </div>
                </label>
            `;
        } else {
            controls += `
                <label class="option-control control-${type}" for="${id}">
                    <input id="${id}" class="hide" name="${iName}" type="${type}" value="${name}" />
                    <div class="control"></div>
                    <div class="text">
                        <div>${name}</div>
                        ${desc ? `<div>${desc}</div>` : ``}
                    </div>
                </label>
            `;
        }
    }

    return controls;
}

/**
 * Create category options.
 * @param {object[]} cOptions
 */
function createCategoryOptions(cOptions) {
    for (let i = 0; i < cOptions.length; i++) {
        const { name, desc, options } = cOptions[i];
        const wrapper = createEl(`div.option-wrapper.option-${slugify(name)}`);

        wrapper.key = name;
        wrapper.innerHTML = `
            <div class="option-desc">${desc}</div>
            <div class="option-select">${createControls(name, options)}</div>
        `

        categoryWrapper.appendChild(wrapper);
    }

    createButtons(cOptions, categoryOpts, selectOption);
}

/**
 * Change page depending of direction.
 * @param {string} direction
 */
function nextPage(direction) {
    const buttons = qa('.category-options button');
    const selButton = q('.category-options button.selected');

    const i = [].indexOf.call(buttons, selButton);
    
    if (direction === 'prev') {
        if (i > 0) {
            buttons[i - 1].click();
        } else if (i === -1) {
            buttons[buttons.length - 1].click();
            categoryWrapper.classList.remove('hide');
        }

        contactFormWrapper.classList.add('hide');
    } else {
        if (i !== -1) {
            if (i < buttons.length - 1) {
                buttons[i + 1].click();
            } else {
                console.log('Show form.');
    
                selButton.classList.remove('selected');
                categoryWrapper.classList.add('hide');
                contactFormWrapper.classList.remove('hide');
            }
        }
    }
}

/**
 * Handle option select.
 * @param {HTMLElement} button
 * @param {string} desc
 * @param {object[]} oOptions
 */
function selectOption(button) {
    const key = button.key;
    const oWrappers = qa('.option-wrapper');

    activeButton(button);

    for (let i = 0; i < oWrappers.length; i++) {
        const wrapper = oWrappers[i];

        if (wrapper.key === key) {
            wrapper.classList.add('visible');
        } else {
            wrapper.classList.remove('visible');
        }
    }
}

/**
 * Handle category select.
 * @param {HTMLElement} button
 * @param {string} name
 * @param {string} string
 * @param {string} img
 */
function selectCategory(button, name, desc, img) {
    activeButton(button);

    categoryDesc.innerHTML = desc;
    categoryImg.setAttribute('src', `design/images/${img}`);
}

if (q('.block.configurator')) {
    // Create category buttons
    createButtons(conf_data, categoryBtns, selectCategory);

    // Create category options buttons
    createCategoryOptions(conf_data[0].options);

    // Create form


    // Initialize page buttons
    on('click', q('.prev-btn'), () => nextPage('prev'));
    on('click', q('.next-btn'), () => nextPage('next'));
}
