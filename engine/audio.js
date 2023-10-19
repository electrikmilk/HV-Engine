/*
 * Audio abstraction
 *
 * Makes it easier to manage audio using channels.
 */

import {$, Element, make_id} from './helpers.js';

let container = new Element('div', {
    class: 'audio-container',
});
let channels = ['music', 'sfx', 'voices']; // default channels

// Change volume for all audio in the channel
export function channelVolume(channel, percent) {
    let volume = (parseInt(percent) / 100);
    let channels = $('[data-channel=\'' + channel + '\']');
    if (channels.length !== 0) {
        channels.volume = volume;
        return true;
    } else {
        return false;
    }
}

export class Audio {
    constructor(data) {
        if (!data) {
            return;
        }
        this.id = make_id('audio');
        this.channel = 'master';
        // create element
        let audio = document.createElement('audio');
        // set attributes
        if (data.constructor === Object) {
            this.src = data.src;
            if (data.channel) {
                this.channel = data.channel;
                if (!channels[this.channel]) {
                    channels.push(this.channel);
                }
            }
            if (data.autoplay && data.autoplay === true) {
                audio.setAttribute('autoplay', null);
            }
            if (data.loop && data.loop === true) {
                audio.setAttribute('loop', null);
            }
        } else {
            this.src = data;
        }
        container.createChild('audio', {
            id: this.id,
            channel: this.channel,
            src: this.src,
        });
        this.element = $('audio#' + this.id);
    }

    toggle() {
        this.element.paused ? this.play() : this.pause();
    }

    play() {
        this.element.play();
    }

    pause() {
        this.element.pause();
    }

    volume(percent) {
        this.element.volume = (parseInt(percent) / 100);
    }

    fadeIn(percent = '100%', timeout = 1000) {
        let volume = (parseInt(percent) / 100);
        this.element.animate({volume: volume}, timeout);
    }

    fadeOut(percent = '0%', timeout = 1000) {
        let volume = (parseInt(percent) / 100);
        this.element.animate({volume: volume}, timeout);
    }
}
