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
		let menus = $(".menu-container");
		if (options) {
			// hide other menus
			if(menus.length !== 0) {
				menus.hide();
			}
			let id = make_id();
			this.id = id;
			this.layer = new Layer("menu", "2", "middle-center");
			this.layer.add("<div class='menu-container' id='" + id + "'></div>");
			options.forEach(function (option) {
				let option_id = make_id();
				$(".menu-container#" + id).append("<div class='menu-item' id='" + option_id + "'>" + option.label + "</div>");
				$(".menu-container#" + id + " > .menu-item#" + option_id).on("click", function () {
					if (option.callback) {
						option.callback();
					}
				});
				if(active_plugins.includes("gamepad")) {
					$(".menu-container#"+id+" .menu-item:first-child").focus();
					let gp = new Gamepad(1);
					gp.on(["left-stick"],"up",function() {
						$(".menu-container#"+id+" .menu-item:focus").prev().focus();
					});
					gp.on(["left-stick"],"down",function() {
						$(".menu-container#"+id+" .menu-item:focus").next().focus();
					});
				}
				if(active_plugins.includes("audio")) { // make sure we can make a sound
					if(active_plugins.includes("mouse")) { // should we ignore the mouse?
						$(".menu-container#" + id + " > .menu-item").on("mouseenter", function () {
							tick.play();
						});
					}
				}
			});
		}
	}
	show(transition) {
		let menus = $(".menu-container");
		// hide other menus
		if(menus.length !== 0) {
			menus.hide();
		}
		let container = $(".menu-container#"+this.id);
		switch (transition) {
			case "fade": {
				container.fadeIn();
			}
			case "slide": {
				container.slideDown();
			}
			default: {
				container.show();
			}
		}
	}
	hide(transition) {
		let container = $(".menu-container#"+this.id);
		switch (transition) {
			case "fade": {
				container.fadeOut();
			}
			case "slide": {
				container.slideUp();
			}
			default: {
				container.hide();
			}
		}
	}
}