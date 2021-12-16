let rAF = window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.requestAnimationFrame;

let rAFStop = window.mozCancelRequestAnimationFrame ||
	window.webkitCancelRequestAnimationFrame ||
	window.cancelRequestAnimationFrame;

const default_plugins = [
	"mouse",
	"keyboard",
	"ui",
	"audio",
	"storage"
];
let active_plugins = []; // to check plugins

let layers = {
	"background": 1,
	"foreground": 2,
	"overlay": 3
};

$(window).on("load", function () {
	// Progress bar
	let bar = $(".progress .determinate");
	setTimeout(function () {
		$({
			property: 0
		}).animate({
			property: 105
		}, {
			duration: 2000,
			step: function () {
				let _percent = Math.round(this.property);
				bar.css("width", _percent + "%");
				if (_percent == 105) {
					bar.css("width", "100%");
				}
			},
			complete: function () {
				bar.css("width", "100% !important");
			}
		});
	}, 1000);
});

$(function () {
	console.timeEnd(readyMessage);
});

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
		this.body.append("<div class='viewport'><div class='scene-container'></div></div>");
		this.viewport = $(".viewport");
		this.scene = $(".scene-container");
		// Load plugins
		if (!plugins) {
			this.plugins = default_plugins;
		} else {
			this.plugins = plugins;
			active_plugins = this.plugins;
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
	constructor() {
		this.container = $(".viewport .scene-container");
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

class Layer {
	constructor(name, index, align = "middle-center") {
		this.id = make_id();
		if (!layers[name]) {
			layers[name] = parseInt(index);
		}
		$(".scene-container").append("<div class='layer align-" + align + "' id='" + this.id + "' style='z-index:" + (1 + layers[name]) + "'><div></div></div>");
		this.element = $(".layer#" + this.id + " > div");
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
