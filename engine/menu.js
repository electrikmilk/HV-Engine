/*
 * Base UI menu class
 */

import {Button} from "./ui.js";
import {config} from "./init.js";

let menuStyle = null;
let menus = [];

export class Menu {
    constructor(options) {
        this.options = options.options ?? [];
        this.buttons = [];
        if (options.buttons) {
            this.setOptions(options.buttons);
        }
        menus.push(this);
    }

    setOptions(options) {
        let startY = config('height') / 2 - 120;
        options.forEach((opt) => {
            const button = new Button({
                onClick: opt.onClick ?? null,
                text: opt.text ?? null,
                y: startY,
                x: config('width') / 2 - 40
            });
            startY += button.height + 10;
            this.buttons.push(button);
        });
    }

    style(callback) {
        menuStyle = callback;
    }
}
