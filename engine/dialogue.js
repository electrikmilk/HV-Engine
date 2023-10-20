/*
 * Base dialogue box
 */

import {config, ctx, Log} from './init.js';
import {color} from './helpers.js';
import {draw} from './screen.js';
import {Audio} from './audio.js';

let current_dialogue = false;
let current_character = 0;
let current_line = 0;
let voices = [];

voices['default'] = new Audio({
    src: './engine/sfx/type2.wav',
    channel: 'voices',
});

export let dialogueStyle = {
    background: () => {
        ctx.fillStyle = 'black';
    },
    border: () => {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
    },
};

export const Dialogue = {
    new: function(options) {
        let this_dialogue = {};
        this_dialogue.text = options.text;
        this_dialogue.position = options.position ?? 'bottom';
        this_dialogue.char = options.char;
        this_dialogue.speed = parseInt(options.speed) ?? 500;
        this_dialogue.color = (options.color) ? color(options.color) : 'white';
        this_dialogue.size = options.size ?? '15';
        this_dialogue.font = options.font ?? config('font');
        this_dialogue.voice = options.voice ?? 'default';
        // set this instance as the current dialogue
        current_dialogue = this_dialogue;
        current_character = 0;
        current_line = 0;
    },
    clear: function() {
        current_dialogue = false;
        current_character = 0;
        current_line = 0;
    },
    load: function(file) {
        $.get(`dialogue/${file}.json`, function(lines, status, xhr) {
            if (status === 'success') {

            } else {
                Log.error('[Dialog.load()]', 'Unable to load dialogue JSON file');
            }
        });
    },
};

draw(async () => {
    if (current_dialogue !== false) {
        let positions = {
            'top': {
                x: 20,
                y: 15,
                width: 600,
                height: 120,
            },
            'bottom': {
                x: 20,
                y: 340,
                width: 600,
                height: 120,
            },
        };
        let position = positions[current_dialogue.position];
        // box background color
        dialogueStyle.background();
        ctx.fillRect(position.x, position.y, position.width, position.height);
        // box background image
        if (current_dialogue.backgroundImage) {
            ctx.drawImage(current_dialogue.backgroundImage, position.x, position.y, position.width, position.height);
        }
        // box border
        dialogueStyle.border();
        ctx.strokeRect(position.x, position.y, position.width, position.height);
        // text
        ctx.font = `${current_dialogue.size}px '${current_dialogue.font}'`;
        ctx.fillStyle = color(current_dialogue.color);
        let lines = current_dialogue.text.split('\n');

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(lines[current_line].substring(0, current_character), position.x + 15, position.y + 15);

        // iterate line
        if (lines[current_line].length === current_character - 1 && current_line !== lines.length - 1) {
            current_character = 0;
            ++current_line;
        }

        // iterate character
        if (current_character !== lines[current_line].length + 1) {
            ++current_character;
            if (lines[current_line].charAt(current_character) !== ' ') {
                voices[current_dialogue.voice].play();
            }
            await new Promise(r => setTimeout(r, current_dialogue.speed));
        } else {
            voices[current_dialogue.voice].pause();
        }
    }
});
