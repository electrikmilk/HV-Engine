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
	"keyboard",
	"gamepad"
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
		this.body.append("<div class='viewport'><div class='scene-container'></div></div>");
		this.viewport = $(".viewport");
		this.scene = $(".scene-container");

		if (!plugins) {
			this.plugins = default_plugins;
		} else {
			this.plugins = plugins;
		}
		this.plugins.forEach(function (plugin) {
			head.append("<script type='text/javascript' id='" + plugin + "' src='engine/plugins/" + plugin + ".plugin.js'></script>");
			sleep(1);
		});
		this.scenes = scenes;
		this.sceneIndex = 0;
		this.load();
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

/* Scenes can extend this class */
class Scene {
	constructor() {
		this.container = $(".viewport .scene-container");
	}

	show(transition) {
		switch (transition) {
			case "fade":
				this.container.fadeIn();
				break;
			case "slide":
				this.container.slideDown();
				break;
			default:
				this.container.show();
				break;
		}
	}

	/* called once every frame */
	loop() {
		rAF(loop);
	}
}
