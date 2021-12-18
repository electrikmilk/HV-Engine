/*
* Audio Plugin
*
* Add this to your project if you would like to play audio and sfx.
* Makes it easier to manage audio and sound effects.
* */

$(function () {
	$("body").prepend("<div class='audio-container'></div>");
});

let channels = ["music", "sfx", "voices"]; // default channels

// Change volume for all audio in the channel
function channel(channel, percent) {
	let volume = (parseInt(percent) / 100);
	let channels = $("[data-channel='" + channel + "']");
	if (channels.length !== 0) {
		$("[data-channel='" + channel + "']").prop("volume", volume);
		return true;
	} else {
		return false;
	}
}

class Audio {
	constructor(data) {
		if (!data) {
			return;
		}
		this.container = $(".audio-container");
		this.id = make_id();
		this.channel = "master";
		let loop = "";
		let autoplay = "";
		if (data.constructor == Object) {
			this.src = data.src;
			if (data.channel) {
				this.channel = data.channel;
				if (!channels[this.channel]) {
					channels.push(this.channel);
				}
			}
			if (data.autoplay) {
				autoplay = "autoplay";
			}
			if (data.loop) {
				loop = "loop";
			}
		} else {
			this.src = data;
		}
		this.container.append("<audio id='" + this.id + "' data-channel='" + this.channel + "' src='" + this.src + "' " + loop + " " + autoplay + "/>");
		this.element = $("audio#" + this.id);
	}

	toggle() {
		if (this.element.get(0).paused) {
			this.play();
		} else {
			this.pause();
		}
	}

	play() {
		this.element.get(0).play();
	}

	pause() {
		this.element.get(0).pause();
	}

	stop() {
		this.element.get(0).stop();
	}

	volume(percent) {
		let volume = (parseInt(percent) / 100);
		this.element.prop("volume", volume);
	}

	fadeIn(percent = "100%", timeout = 1000) {
		let volume = (parseInt(percent) / 100);
		this.element.animate({volume: volume}, timeout);
	}

	fadeOut(percent = "0%", timeout = 1000) {
		let volume = (parseInt(percent) / 100);
		this.element.animate({volume: volume}, timeout);
	}
}