/*
 * Helper functions and classes
 */

// Override default css colors, make the contrast less harsh
const colors = {
    'pink': '#f28db2',
    'red': '#d4293f',
    'orange': '#f28907',
    'darkorange': '#a65e1f',
    'yellow': '#f2b807',
    'green': '#3c861e',
    'olive': '#8fa65d',
    'darkolive': '#384001',
    'seagreen': '#0be0a8',
    'cyan': '#0ce6ea',
    'blue': '#1c4ef2',
    'darkblue': '#2d3cad',
    'indigo': '#5f49f2',
    'purple': '#a85fd9',
    'darkpurple': '#582f68',
    'brown': '#a65e1f',
    'darkbrown': '#592202',
    'lightgrey': '#888888',
    'grey': '#555555',
    'darkgrey': '#333333',
    'black': '#121212',
};

export function color(color) {
    if (colors[color]) {
        return colors[color];
    }
    return color;
}

export async function sleep(ms) {
    new Promise(r => setTimeout(r, ms * 1000));
}

export const make_id = (prefix = 'id') => prefix + '-' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

function make_guid(prefix = 'guid') {
    return prefix + '-' + (make_id() + make_id() + '-' + make_id() + '-' + make_id() + '-' + make_id() + '-' + make_id() + make_id() + make_id());
}

function make_uuid(prefix = 'uuid') {
    return prefix + '-' + ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
    );
}

export function $(selector) {
    return document.querySelector(selector);
}

export function $all(selector) {
    return document.querySelectorAll(selector);
}

export function tempElement(tagName, attributes, callback) {
    let temp = new Element(tagName, attributes);
    temp.style('display', 'none');
    callback(temp.element);
    temp.remove();
}

export class Element {
    constructor(selector, attributes) {
        if (document.querySelector(selector)) {
            this.element = $(selector);
            this.parent = this.element.parentElement;
            if (this.element.id) {
                this.id = this.element.id;
            }
            return this;
        }

        this.element = document.createElement(selector);
        this.element.id = 'element-' + make_id();
        this.id = this.element.id;
        if (attributes) {
            for (let attribute in attributes) {
                if (attribute === 'class') {
                    this.element['className'] = attributes[attribute];
                } else if (attribute === 'text') {
                    this.element['innerText'] = attributes[attribute];
                } else if (attribute === 'html') {
                    this.element['innerHTML'] = attributes[attribute];
                } else if (attribute === 'editable') {
                    this.element['contentEditable'] = attributes[attribute];
                } else if (attribute === 'parent') {
                    this.parent = attributes[attribute];
                } else {
                    this.element[attribute] = attributes[attribute];
                }
            }
        }
        if (!this.parent) {
            this.parent = document.querySelector('body');
        }
        this.parent.appendChild(this.element);
        this.element = $(`${selector}#${this.id}`);

        return this;
    }

    on(event, callback) {
        this.element.addEventListener(event, callback);
    }

    onClick(callback) {
        this.element.onclick = callback;
    }

    onChange(callback) {
        this.element.onchange = callback;
    }

    onKeyup(callback) {
        this.element.onkeyup = callback;
    }

    remove() {
        this.element.remove();
    }

    style(property, value) {
        this.element.style[property] = color(value);
        return this;
    }

    createChild(selector, attributes) {
        attributes['parent'] = this.element;
        return new Element(selector, attributes);
    }
}

export const TRY = func => {
    try {
        return [func(), null];
    } catch (e) {
        return [null, e];
    }
};

export const MUST = func => {
    try {
        return [func(), null];
    } catch (e) {
        throw new Error(e.message);
    }
};

export const empty = value => {
    return value === undefined || typeof value === 'undefined' || value === null || (!value && value !== 0 && value !== false);
};
