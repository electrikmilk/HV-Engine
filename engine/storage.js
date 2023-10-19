/*
 * Simple local storage helpers
 */

import {empty} from './helpers.js';

export function set(key, value) {
    if (empty(value)) {
        localStorage.setItem(key, null);
        return;
    }

    localStorage.setItem(key, JSON.stringify({
        type: typeof value,
        value: value,
    }));
}

export function get(key) {
    if (!localStorage.getItem(key)) {
        return false;
    }

    let item = JSON.parse(localStorage.getItem(key));
    let value = item.value;
    switch (item.type) {
        case 'number':
            return parseInt(value);
        case 'float':
            return parseFloat(value);
        case 'boolean':
            return (value);
        default:
            return value;
    }
}

export function forget(key) {
    if (!localStorage.getItem(key)) {
        return;
    }

    localStorage.removeItem(key);
}
