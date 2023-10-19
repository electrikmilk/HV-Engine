/*
 * Main canvas drawing loop and helper functions
 */

import {config, ctx, frame} from "./init.js";
import {color} from "./helpers.js";

let drawCallbacks = [];

export function draw(callback) {
    drawCallbacks.push(callback);
}

export async function canvasDraw() {
    clear();
    ctx.save();

    ctx.fillStyle = color(config('backgroundColor'));
    ctx.fillRect(0, 0, config('width'), config('height'));

    if (config('backgroundImage')) {
        ctx.drawImage(config('backgroundImage'), 0, 0, config('width'), config('height'));
    }

    drawCallbacks.sort();
    for (const callback in drawCallbacks) {
        drawCallbacks[callback]();
    }

    ctx.restore();
    window.requestAnimationFrame(canvasDraw);
}

export function clear() {
    ctx.clearRect(0, 0, config('width'), config('height'));
}

export function pause() {
    window.cancelAnimationFrame(frame);
}

export function composite(value) {
    // destination-over
    ctx.globalCompositeOperation = value;
}

export function toggleFullscreen() {
    if (window.fullscreenElement) {
        document.exitFullscreen();
    } else {
        const documentElement = document.documentElement;
        if (documentElement.requestFullscreen) {
            documentElement.requestFullscreen();
        } else if (documentElement.webkitRequestFullscreen) {
            documentElement.webkitRequestFullscreen();
        } else if (documentElement.msRequestFullscreen) {
            documentElement.msRequestFullscreen();
        }
    }
}
