import {Element} from './helpers.js';
import {canvasDraw, toggleFullscreen} from './screen.js';
import {drawMouse} from './mouse.js';

export let frame;
export let ctx;
export let canvas;

let defaultOptions = {
    width: 640,
    height: 480,
    backgroundColor: 'darkgrey',
    backgroundImage: null,
    font: 'Helvetica',
    fullscreen: false,
};

let configs = {};

export function init(options, startCallback) {
    console.time('HV2D_ready');
    if (options) {
        configs = options;
    }
    // Style the body
    new Element('body').style('display', 'flex').style('justify-content', 'center').style('align-items', 'center').style('margin', 0).style('padding', 0).style('height', '100vh').style('background', 'black');

    const startButton = new Element('img', {
        src: './engine/play.svg',
        width: 80,
        height: 80,
    });
    startButton.onClick(() => {
        // Create canvas and start drawing loop.
        canvas = new Element('canvas');
        if (!config('fillScreen')) {
            canvas.element['width'] = config('width');
            canvas.element['height'] = config('height');
        } else {
            canvas.style('width', '100vw');
            canvas.style('height', '100vh');
        }
        if (config('fullscreen')) {
            toggleFullscreen();
        }
        ctx = canvas.element.getContext('2d');
        frame = window.requestAnimationFrame(canvasDraw);

        drawMouse();

        startButton.remove();

        // Call user start callback
        if (!startCallback) {
            throw new Error('[HV2D] Please provide the init() function with a callback');
        }
        startCallback();
    });
    console.timeEnd('HV2D_ready');
}

export function config(key) {
    if (Object.hasOwn(configs, key)) {
        return configs[key];
    }

    if (Object.hasOwn(defaultOptions, key)) {
        return defaultOptions[key];
    }

    return null;
}

let logMessage = ['[HV2D]'];

export const Log = {
    log: (message) => {
        console.log(log(message, '[DEBUG]'));
    },
    info: (message) => {
        console.info(log(message, '[INFO]'));
    },
    warn: (message) => {
        console.warn(log(message, '[WARN]'));
    },
    error: (message) => {
        console.error(log(message, '[ERROR]'));
    },
};

function log(message, prefix) {
    logMessage.push(prefix, message);
    const init = logMessage;
    message = logMessage.join(' ');
    logMessage = init;
    return message;
}
