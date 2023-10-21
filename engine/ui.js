/*
 * UI abstraction
 *
 * Base canvas textbox and button.
 */

import {Sprite} from './sprite.js';
import {Text} from './text.js';
import {draw} from './screen.js';
import {setCursor} from './mouse.js';
import {color} from './helpers.js';

let ui = [];

class UI {
    constructor(type, options) {
        const config = options ?? {};

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.width = config.width;
        this.height = config.height;
        this.background = config.background ?? 'white';
        this.border = config.border;
        this.textColor = config.textColor ?? 'black';
        this.type = type;
    }
}

export class Textbox extends UI {
    constructor(options) {
        const config = options ?? {};
        super('textbox', config);

        this.width = config.width ?? 150;
        this.height = config.height ?? 40;
        this.value = config.value ?? '';

        this.box = new Sprite({
            background: this.background,
            border: this.border,
            width: this.width,
            height: this.height,
            x: this.x,
            y: this.y,
        });

        let textObj = {
            x: this.x + 10,
            y: this.y + 20,
            content: this.value,
            width: this.width - 15,
            height: this.height - 15,
            color: this.textColor,
            align: 'left',
            baseline: 'middle',
        };
        let placeholderObj = structuredClone(textObj);
        placeholderObj.content = config.placeholder ?? '';
        placeholderObj.color = 'gray';
        this.placeholder = new Text(placeholderObj);
        this.text = new Text(textObj);

        this.cursor = new Sprite({
            x: this.x + 10,
            y: this.y + 10,
            width: 1,
            height: this.height - 20,
            background: 'black',
            name: 'cursor',
        });
        this.cursor.visible = false;

        this.box.hover(() => {
            setCursor('text');
        });
        this.box.hoverEnd(() => {
            setCursor('default');
        });
        this.box.click(() => {
            this.focused = true;
            this.cursor.flash();
        });
        this.box.clickOutside(() => {
            this.focused = false;
            this.cursor.stopFlashing();
            this.cursor.visible = false;
        });

        this.focused = false;

        ui.push(this);
    }

    setText(text) {
        this.value = text;
        this.text.text = text;
        if (!text || text === '') {
            this.cursor.x = this.x + 10;
        }
    }

    setTextColor(c) {
        this.text.color = color(c);
    }

    setBackground(c) {
        this.box.background = color(c);
    }

    setBorder(c) {
        this.box.border = color(c);
    }
}

export class Button extends UI {
    constructor(options) {
        super('button', options);
        const config = options ?? {};

        this.buttonText = config.text ?? 'Button';
        this.width = config.width ?? 100;
        this.height = config.height ?? 40;
        this.sprite = new Sprite({
            background: this.background,
            width: this.width,
            height: this.height,
            x: this.x,
            y: this.y,
        });
        this.text = new Text({
            align: 'center',
            baseline: 'middle',
            x: this.x + (this.width / 2),
            y: this.y + (this.height / 2),
            width: this.width,
            height: this.height,
            color: this.textColor,
            content: this.buttonText ?? 'Button',
        });
        if (config.onClick) {
            this.sprite.click(config.onClick);
        }
        ui.push(this);
    }

    click(callback) {
        this.sprite.click(callback);
        return this;
    }

    clickEnd(callback) {
        this.sprite.clickEnd(callback);
        return this;
    }

    clickOutside(callback) {
        this.sprite.clickOutside(callback);
        return this;
    }

    hover(callback) {
        this.sprite.hover(callback);
        return this;
    }

    hoverEnd(callback) {
        this.sprite.hoverEnd(callback);
        return this;
    }

    setBackground(c) {
        this.sprite.background = color(c);
        return this;
    }

    setBorder(c) {
        this.sprite.border = color(c);
        return this;
    }

    setTextColor(c) {
        this.text.color = color(c);
        return this;
    }
}

draw(() => {
    ui.forEach(element => {
        switch (element.type) {
            case 'textbox':
                textbox(element);
                if (element.placeholder) {
                    element.placeholder.visible = element.value.length === 0;
                }
                break;
            case 'button':
                break;
        }
    });
});

function focusTextbox(textbox) {
    textbox.focused = true;
    textbox.cursor.flash();
}

function unfocusTextbox(textbox) {
    textbox.focused = false;
    textbox.cursor.stopFlashing();
    textbox.cursor.hide();
}

function textbox(textbox) {
    if (!textbox.triggers) {
        document.addEventListener('keypress', e => {
            if (!textbox.focused) {
                return;
            }
            if (e.key === 'Enter') {
                return;
            }
            if (textbox.value) {
                textbox.value += e.key;
                if ((textbox.text.measure().width + 10) < textbox.box.width + 10) {
                    textbox.text.content = textbox.value;
                }
            } else {
                textbox.text.content = textbox.value = e.key;
            }
            textbox.cursor.x += textbox.text.measure().actualBoundingBoxRight / textbox.text.content.length + 3;
        });
        document.addEventListener('keydown', (e) => {
            if (!textbox.focused) {
                return;
            }
            switch (e.key) {
                case 'Backspace':
                    const text = textbox.text.content;
                    if (text.length > 0) {
                        if (text.length === 1) {
                            textbox.cursor.x = textbox.x + 10;
                        } else {
                            textbox.cursor.x -= textbox.text.measure().actualBoundingBoxRight / textbox.text.content.length + 3;
                        }
                        if (textbox.value) {
                            textbox.value = text.substring(0, (text.length - 1));
                            if ((textbox.text.measure().width + 10) < textbox.box.width) {
                                textbox.text.content = textbox.value;
                            }
                        }
                    }
                    break;
                case 'Tab':
                    let tabbedToNextTextbox = false;
                    for (const u in ui) {
                        const otherTextbox = ui[u];
                        if (otherTextbox === textbox) {
                            continue;
                        }
                        if (otherTextbox.type !== 'text') {
                            continue;
                        }
                        if (otherTextbox.x > textbox.x) {
                            unfocusTextbox(textbox);
                            focusTextbox(otherTextbox);
                            tabbedToNextTextbox = true;
                            break;
                        }
                    }
                    if (!tabbedToNextTextbox) {
                        let textboxes = ui.filter(e => {
                            return e.type === 'textbox';
                        });
                        if (textboxes.length > 1) {
                            const firstTextbox = textboxes.sort((a, b) => {
                                return parseFloat(a.x) - parseFloat(b.x);
                            })[0];
                            unfocusTextbox(textbox);
                            focusTextbox(firstTextbox);
                        }
                    }
                    break;
            }
        });
        textbox.triggers = true;
    }
}
