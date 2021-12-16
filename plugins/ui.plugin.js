/*
* UI Plugin
*
* Add this to your project if you would like to use standard UI
* This makes it easier to present the user with options, ask for input, etc. without the need to do them yourself
* */

/* WIP */

// for now this will require the audio plugin, as I get into this more I will make this optional if you don't want ur game to have audio
let tick = new Audio({
	src: "engine/res/sfx/tick.wav",
	channel: "sfx"
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
		// $("body").append("<div class='overlay'></div>");
		// options.items;
		// options.items.label;
		// options.items.description;
		// options.items.callback;
		this.overlay = new Overlay("middle-center");

	}
}