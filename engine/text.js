/*
 * Canvas text abstraction
 */

import {config, ctx} from './init.js';
import {color} from './helpers.js';
import {draw} from './screen.js';

let texts = [];

export class Text {
    constructor(options) {
        this.content = options.content ?? '';
        this.color = (options.color) ? color(options.color) : 'white';
        this.font = options.font ?? config('font');
        this.size = options.size ?? 18;
        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.width = options.width ?? null;
        this.position = options.position ?? null;
        this.flashInterval = null;
        this.baseline = options.baseline ?? 'top';
        this.align = options.align ?? 'left';
        this.visible = true;
        if (options.flashing) {
            this.flash();
        }
        texts.push(this);
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.stopFlashing();
        this.visible = false;
    }

    flash(seconds = .5, times = 0) {
        if (!this.visible) {
            this.show();
        }
        seconds = seconds * 1000;
        let self = this;
        let flashed = 0;
        this.flashInterval = setInterval(function() {
            if (this.visible) {
                self.hide();
            } else {
                self.show();
            }
            flashed++;
            if (times !== 0) {
                if (flashed > times) {
                    self.stopFlashing();
                }
            }
        }, seconds);
    }

    measure() {
        return ctx.measureText(this.content);
    }

    stopFlashing() {
        if (!this.flashInterval) {
            return;
        }
        clearInterval(this.flashInterval);
    }
}

setTimeout(() => {
    draw(() => {
        ctx.save();
        if (texts.length !== 0) {
            texts.forEach((txt) => {
                if (!txt.content) {
                    return;
                }
                if (!txt.visible) {
                    return;
                }
                let txt_x = txt.x;
                let txt_y = txt.y;
                ctx.font = `${txt.size}px '${txt.font}'`;
                if (txt.align) {
                    ctx.textAlign = txt.align;
                }
                if (txt.baseline) {
                    ctx.textBaseline = txt.baseline;
                }
                if (txt.direction) {
                    ctx.direction = txt.direction;
                }
                if (txt.color) {
                    ctx.fillStyle = txt.color;
                } else if (!txt.stroke) {
                    ctx.fillStyle = 'black';
                }
                if (txt.position) {
                    let position = txt.position.split(' ');
                    let x = position[0];
                    let y = position[1];
                    ctx.textAlign = x;
                    ctx.textBaseline = y;
                    switch (x) {
                        case 'left':
                            txt_x = txt.x;
                            break;
                        case 'center':
                            txt_x = config('width') / 2 + txt_x;
                            break;
                        case 'right':
                            txt_x = config('width') - txt.x;
                            break;
                    }
                    switch (y) {
                        case 'top':
                            txt_y = txt.y;
                            break;
                        case 'middle':
                            txt_y = config('height') / 2 + txt_y;
                            break;
                        case 'bottom':
                            txt_y = config('height') - txt.y;
                            break;
                    }
                }
                if (txt.stroke) {
                    if (txt.stroke.width) {
                        ctx.strokeWidth = txt.stroke.width;
                    }
                    if (txt.stroke.color) {
                        ctx.strokeColor = txt.stroke.color;
                    }
                    if (!txt.width) {
                        ctx.strokeText(txt.content, txt_x, txt_y);
                    } else {
                        ctx.strokeText(txt.content, txt_x, txt_y, txt.width);
                    }
                } else {
                    if (!txt.width) {
                        ctx.fillText(txt.content, txt_x, txt_y);
                    } else {
                        ctx.fillText(txt.content, txt_x, txt_y, txt.width);
                    }
                }
            });
        }
        ctx.restore();
    });
}, 500);
