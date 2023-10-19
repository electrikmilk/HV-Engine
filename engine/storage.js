/*
 * Simple local storage helpers
 */

export function set(key, value) {
    if (!value) {
        localStorage.setItem(key, null);
        return;
    }
    if (typeof value === 'object') {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
}

export function get(key, json = false) {
    if (localStorage.getItem(key)) {
        if (json) {
            return JSON.parse(localStorage.getItem(key));
        }
        return localStorage.getItem(key);
    }
    return null;
}
