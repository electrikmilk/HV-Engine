/*
* Audio Plugin
*
* Add this to your project if you would like to play audio and sfx.
* Makes it easier to manage audio and sound effects.
* */

$(function() {
	$("body").prepend("<div class='audio-container'></div>");
});

let channels = []; // eg. "music","sfx","voices"

function channel(channel,percent) {
	let volume = (parseInt(percent) / 100);
	let channels = $("[data-channel='"+channel+"']");
	if(channels.length !== 0) {
		$("[data-channel='"+channel+"']").prop("volume",volume);
		return true;
	} else {
		return false;
	}
}

class Audio {
	constructor(data) {
		if(!data) {
			return;
		}
		this.container = $(".audio-container");
		this.id = make_id();
		this.channel = "master";
		if (!Array.isArray(data)) {
			this.src = data;
		} else {
			this.src = data.src;
			if (data.channel) {
				this.channel = data.channel;
				if (!channels[this.channel]) {
					channels.push(this.channel);
				}
			}
		}
		this.container.append("<audio id='" + this.id + "' data-channel='" + this.channel + "' src='" + this.src + "'/>");
		this.element = $("audio#" + this.id);
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