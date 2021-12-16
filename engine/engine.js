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

$(function () {
	console.timeEnd(readyMessage);
	// Progress bar
	$(".progress .determinate").css("width", "25%");
});

class Game {
	constructor(scenes, plugins) {
		if (!scenes) {
			console.error("[Game.constructor()]:", "No scenes have been defined", scenes);
			return;
		}
		if (!Array.isArray(scenes)) {
			console.error("[Game.constructor()]:", "Scenes have not been given as an Array", scenes);
			return;
		}
		this.viewport = $(".viewport");
		this.scene = $(".scene-container");
		$("p").text("Loading plugins...");
		$(".progress .determinate").css("width", "50%");
		// Load plugins
		if (!plugins) {
			this.plugins = default_plugins;
		} else {
			this.plugins = plugins;
			active_plugins = this.plugins;
		}
		let timeout = 1000;
		this.plugins.forEach(function (plugin) {
			setTimeout(function () {
				$("head").append("<script type='text/javascript' id='" + plugin + "' src='engine/plugins/" + plugin + ".plugin.js'></script>\n");
			}, (timeout + 1000));
		});
		$(".progress .determinate").css("width", "100%");
		console.info("[Game.constructor()]:", "Project initialized. Loading first scene...", [scenes, plugins]);
		let that = this;
		setTimeout(function () {
			$("body").html("<div class='viewport'><div class='scene-container'></div></div>");
			// Start scenes
			that.scenes = scenes;
			that.sceneIndex = 0;
			that.load();
		}, (timeout + 1000));
	}

	view(width, height) {
		if (width) this.viewport.css("width", width);
		if (height) this.viewport.css("height", height);
	}

	load(scene, transition) {
		if (scene) {
			if (!this.scenes.includes(scene)) {
				console.error("[Game.load()]:", "Scene '" + scene + "' has not been defined.", scene);
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
		$(".scene").remove();
		this.scene.html("");
		let file = this.scenes[this.sceneIndex];
		console.info("[Game.load()]:", "Loading scene '" + file + "' (" + this.sceneIndex + ")...", file);
		$.get("scenes/" + file + ".scene.js", function (data, status, xhr) {
			if (status !== "success") {
				console.error("[Game.load()]:", "Scene file '" + file + ".scene.js' responded with " + status + ".", [status, xhr]);
			} else {
				setTimeout(function () {
					$("head").append("<script type='text/javascript' class='scene' src='scenes/" + file + ".scene.js'></script>");
					console.info("[Game.load()]:", "Loaded scene '" + file + "'");
				}, 1000);
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
