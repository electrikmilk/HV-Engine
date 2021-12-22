/*
* UI Plugin (WIP)
*
* Add this to your project if you would like to use standard UI
* This makes it easier to present the user with options, ask for input, etc. without the need to do them yourself
* */

let tick;

$(function() {
	if(active_plugins.includes("audio")) {
		tick = new Audio({
			src: "engine/res/sfx/tick.wav",
			channel: "sfx"
		});
	}
});

class UI {
	constructor(type) {
		let element;
		$("body").append(element);
	}
}

class Button {
	constructor(options) {
		let type = "";
		if (options.type) {
			type = options.type;
		}
		this.id = make_id();
		let element = "<button id='ui-button-" + this.id + "' class='" + type + "'>" + options.label + "</button>";
	}
}

class Menu {
	constructor(options) {
		if (options) {
			let id = make_id();
			this.id = id;
			this.layer = new Layer("menu", "2", "middle-center");
			this.layer.content("<div class='menu-container' id='" + id + "'></div>");
			options.forEach(function (option) {
				let option_id = make_id();
				$(".menu-container#" + id).append("<div class='menu-item' id='" + option_id + "'>" + option.label + "</div>");
				$(".menu-container#" + id + " > .menu-item#" + option_id).on("click", function () {
					if (option.callback) {
						option.callback();
					}
				});
				if(active_plugins.includes("audio")) {
					$(".menu-container#" + id + " > .menu-item").on("mouseenter", function () {
						tick.play();
					});
				}
			});

		}
	}
}