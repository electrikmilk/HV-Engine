let rAF = window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.requestAnimationFrame;

let rAFStop = window.mozCancelRequestAnimationFrame ||
	window.webkitCancelRequestAnimationFrame ||
	window.cancelRequestAnimationFrame;

$(function () {
	console.timeEnd(readyMessage);
});

class Game {
	constructor(scenes) {
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
		this.scene = $(".scene");
		this.scenes = scenes;
		this.sceneIndex = 0;
		this.load();
	}

	load(scene,transition) {
		if (scene) {
			if (!this.scenes.includes(scene)) {
				console.error("Game.load()", "Scene '" + scene + "' has not been defined.", scene);
				return;
			}
			this.sceneIndex = this.scenes.indexOf(scene);
		}
		$(".scene").remove();
		switch (transition) {
			case "fade":
				$(".scene-container").fadeOut();
				break;
			case "slide":
				$(".scene-container").slideUp();
				break;
			default:
				$(".scene-container").hide();
				break;
		}

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

/* Scene extends this class */
class Scene {
	constructor() {
		this.container = $(".viewport .scene-container");
	}

	loop() {
		rAF(loop);
	}
}
