/*
 * Mouse abstraction
 *
 * Adds click and hover mouse events to Sprites.
 * Optionally draws a custom mouse cursor or sets the built-in cursor type.
 */

import {colliding} from './physics.js';
import {canvas} from './init.js';
import {color} from './helpers.js';
import {Sprite} from './sprite.js';

/* Cursor */

let cursor = 'default';

export function setCursor(style = 'default') {
    canvas.style('cursor', style);
}

export function hideCursor() {
    cursor = 'none';
}

export function toggleCursor() {
    if (cursor === 'none') {
        setCursor();
        return;
    }
    hideCursor();
}

export function customCursor(options) {
    if (options.image) {
        MouseSprite.image = options.image;
    }
    if (options.color) {
        MouseSprite.color = color(options.color);
    }
    if (options.width) {
        MouseSprite.width = options.width;
    }
    if (options.height) {
        MouseSprite.height = options.height;
    }
    if (options.image) {
        MouseSprite.image = options.image;
    }
}

/* Mouse Events */

let mouseCallbacks = {
    'mousemove': [],
    'mouseup': [],
    'mousedown': [],
};

export const Mouse = {
    on: (state, callback) => {
        mouseCallbacks[state].push(callback);
    },
    move(callback) {
        this.on('mousemove', callback);
    },
    click(callback) {
        this.on('mousedown', callback);
    },
    clickEnd(callback) {
        this.on('mouseup', callback);
    },
};

let spriteMouseCallbacks = {
    'mousemove': [],
    'mouseup': [],
    'mousedown': [],
    'mouseout': [],
    'clickout': [],
};

export let MouseSprite;

function spriteMouseCallback(state, obj, callback) {
    spriteMouseCallbacks[state].push({
        sprite: obj,
        callback: callback,
    });
}

Sprite.prototype.click = function(callback) {
    spriteMouseCallback('mousedown', this, callback);
};

Sprite.prototype.clickEnd = function(callback) {
    spriteMouseCallback('mouseup', this, callback);
};

Sprite.prototype.hover = function(callback) {
    spriteMouseCallback('mousemove', this, callback);
};

Sprite.prototype.hoverEnd = function(callback) {
    spriteMouseCallback('mouseout', this, callback);
};

Sprite.prototype.clickOutside = function(callback) {
    spriteMouseCallback('clickout', this, callback);
};

export function drawMouse() {
    canvas.on('mousemove', (e) => {
        const x = e.pageX - canvas.element.offsetLeft;
        const y = e.pageY - canvas.element.offsetTop;
        MouseSprite.x = x;
        MouseSprite.y = y;

        for (const state in spriteMouseCallbacks) {
            for (const i in spriteMouseCallbacks[state]) {
                const interaction = spriteMouseCallbacks[state][i];
                if (!interaction.sprite || !interaction.callback) {
                    continue;
                }
                switch (state) {
                    case 'mousemove':
                        if (colliding(MouseSprite, interaction.sprite)) {
                            interaction.callback(e);
                        }
                        break;
                    case 'mouseout':
                        if (!colliding(MouseSprite, interaction.sprite)) {
                            interaction.callback(e);
                        }
                        break;
                }
            }
        }
    });
    canvas.on('mousedown', (e) => {
        clickCallback(e, 'mousedown', true);
        clickCallback(e, 'clickout', false);
    });
    canvas.on('mouseup', (e) => {
        clickCallback(e, 'mouseup', true);
    });
    MouseSprite = new Sprite({
        name: 'Mouse',
        shape: 'rectangle',
        image: null,
        color: null,
        width: 32,
        height: 32,
        x: 0,
        y: 0,
    });
}

function clickCallback(e, state, collides) {
    for (const i in spriteMouseCallbacks[state]) {
        const interaction = spriteMouseCallbacks[state][i];
        if (!interaction.sprite || !interaction.callback) {
            continue;
        }
        if (colliding(MouseSprite, interaction.sprite) === collides) {
            interaction.callback(e);
        }
    }
    for (const i in mouseCallbacks[state]) {
        const interaction = mouseCallbacks[state][i];
        if (!interaction.callback) {
            continue;
        }
        interaction.callback(e);
    }
}
