let rAF = window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.requestAnimationFrame;

let rAFStop = window.mozCancelRequestAnimationFrame ||
	window.webkitCancelRequestAnimationFrame ||
	window.cancelRequestAnimationFrame;

$(function () {
	console.timeEnd(readyMessage);
});

const default_plugins = [
	"mouse",
	"keyboard",
	"ui",
	"audio",
	"storage"
];

class Game {
	constructor(scenes, plugins) {
		if (!scenes) {
			console.error("Game.constructor()", "No scenes have been defined", scenes);
			return;
		}
		if (!Array.isArray(scenes)) {
			console.error("Game.constructor()", "Scenes have not been given as an Array", scenes);
			return;
		}
		this.head = $("head");
		this.body = $("body");
		this.body.append("<div class='viewport'><div class='overlays-container'></div><div class='scene-container'></div></div>");
		this.viewport = $(".viewport");
		this.scene = $(".scene-container");
		// Load plugins
		if (!plugins) {
			this.plugins = default_plugins;
		} else {
			this.plugins = plugins;
		}
		this.plugins.forEach(function (plugin) {
			head.append("<script type='text/javascript' id='" + plugin + "' src='engine/plugins/" + plugin + ".plugin.js'></script>");
			sleep(1);
		});
		// Start scenes
		this.scenes = scenes;
		this.sceneIndex = 0;
		this.load();
	}

	view(width, height) {
		if (width) this.viewport.css("width", width);
		if (height) this.viewport.css("height", height);
	}

	load(scene, transition) {
		if (scene) {
			if (!this.scenes.includes(scene)) {
				console.error("Game.load()", "Scene '" + scene + "' has not been defined.", scene);
				return;
			}
			this.sceneIndex = this.scenes.indexOf(scene);
		}
		switch (transition) {
			case "fade":
				this.scene.fadeOut();
				break;
			case "slide":
				this.scene.slideUp();
				break;
			default:
				this.scene.hide();
				break;
		}
		sleep(3);
		this.scene.html("");
		let file = this.scenes[sceneIndex];
		console.info("Game.load()", "Loading scene '" + file + "' (" + this.sceneIndex + ")...", file);
		$.get("scenes/" + file + ".scene.js", function (data, status, xhr) {
			if (status !== "success") {
				console.error("Game.load()", "Scene file '" + file + ".scene.js' responded with " + status + ".", [status, xhr]);
				return;
			} else {
				this.head.append("<script type='text/javascript' class='scene' id='" + sceneIndex + "' src='scenes/" + file + ".scene.js'></script>");
				console.info("Game.load()", "Loaded scene '" + file + "' (" + this.sceneIndex + ")");
			}
		});
	}
}

class Scene {
	constructor(options) {
		this.layers = ["foreground", "background"]; // default
		this.container = $(".viewport .scene-container");
		if (options) {
			if (options.layers) this.layers = options.layers;
		}
	}

	start(transition) {
		this.loop();
		switch (transition) {
			case "cut":
				this.container.show();
				break;
			case "slide":
				this.container.slideDown();
				break;
			default:
				this.container.fadeIn();
				break;
		}
	}

	// Called once every frame
	loop() {
		rAF(loop);
	}
}

// For menus and static elements (eg. HP bar, etc.)
class Overlay {
	constructor() {
		this.id = make_id();
		$(".overlays-container").append("<div class='overlay' id='" + this.id + "'></div>");
		this.element = $(".overlay#" + this.id);
	}

	content(html) {
		this.element.html(html);
	}
}

class Sprite {
	constructor(options) {
		// set position
		if (this.options.x && this.options.y) {

		}
	}
}
