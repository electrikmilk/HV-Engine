let requestFullscreen;
let rAF = window.mozRequestAnimationFrame ||
	window.requestAnimationFrame;

let rAFStop = window.mozCancelRequestAnimationFrame ||
	window.webkitCancelRequestAnimationFrame ||
	window.cancelRequestAnimationFrame;

// Plugins
const required_plugins = ["objects"];
const default_plugins = [
	"mouse",
	"keyboard",
	"audio",
	"ui",
	"storage"
];
let active_plugins = [];

// Override default colors
let color_palette = {
	"pink": "#f28db2",
	"red": "#f21d2f",
	"orange": "#f28907",
	"darkorange": "#a65e1f",
	"yellow": "#f2b807",
	"green": "#00cc00",
	"olive": "#8fa65d",
	"darkolive": "#384001",
	"seagreen": "#0be0a8",
	"cyan": "#0ce6ea",
	"blue": "#527af2",
	"darkblue": "#2d3cad",
	"indigo": "#5f49f2",
	"purple": "#a85fd9",
	"darkpurple": "#582f68",
	"brown": "#a65e1f",
	"darkbrown": "#592202",
	"lightgrey": "#888888",
	"grey": "#555555",
	"darkgrey": "#333333",
	"black": "#121212"
};

// Init Layers
let layers = [
	{
		name: "background",
		index: 1
	},
	{
		name: "foreground",
		index: 2
	}
];

$(function () {
	console.timeEnd(readyMessage);
	// Progress bar
	$(".progress .determinate").css("width", "25%");
	// Add default layers
	for (var layer in layers) {
		layers.object = new Layer(layer.name, layer.index, false);
	}
	$.get("engine/res/init.html", function (response, status, xhr) {
		if (status === "success") {
			$("body").html(response);
		} else {
			console.error("HV-Engine/document.ready", "Could not load loading DOM", status, xhr);
		}
	});
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
		let timeout = 1000;
		this.view = $(".viewport");
		this.scene = $(".scene-container");
		let status = $("p#status");
		let progress = $(".progress .determinate");
		status.text("Loading plugins...");
		progress.css("width", "50%");
		// Required plugins
		required_plugins.forEach(function (plugin) {
			if (!plugins.includes(plugin)) {
				plugins.unshift(plugin);
			}
		});
		// Load plugins
		if (!plugins) {
			this.plugins = default_plugins;
		} else {
			this.plugins = plugins;
			active_plugins = this.plugins;
		}
		this.plugins.forEach(function (plugin) {
			setTimeout(function () {
				$("head").append("<script type='text/javascript' id='" + plugin + "' src='engine/plugins/" + plugin + ".plugin.js'></script>\n");
			}, (timeout + 1000));
		});
		progress.css("width", "100%");
		console.info("[Game.constructor()]:", "Project initialized. Loading first scene...", [scenes, plugins]);
		let that = this;
		setTimeout(function () {
			// Start first scene
			$("body").html("<div class='container'><div class='viewport'></div></div>");
			that.scenes = scenes;
			that.sceneIndex = 0;
			that.load();
		}, (timeout + 1000));
	}

	exit() {
		window.stop();
		$("body").html("");
		delete this;
	}

	fullscreen(bool) {
		if (bool === true) {
			requestFullscreen = setInterval(function () {
				if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
					clearInterval(requestFullscreen);
				} else {
					let elem = document.documentElement;
					if (elem.requestFullscreen) {
						elem.requestFullscreen();
					} else if (elem.webkitRequestFullscreen) {
						elem.webkitRequestFullscreen();
					} else if (elem.msRequestFullscreen) {
						elem.msRequestFullscreen();
					}
				}
			}, 2500);
		} else {
			if (requestFullscreen) {
				clearInterval(requestFullscreen);
			}
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}
	}

	viewport(width, height) {
		if (width) this.view.css("width", width);
		if (height) this.view.css("height", height);
		if (this.view.find("canvas").length !== 0) {
			if (width) this.view.find("canvas").css("width", width);
			if (height) this.view.find("canvas").css("height", height);
		}
	}

	async shake(deg = 5, between = 100) {
		this.view.css("transform", "rotate(" + deg + "deg)");
		await sleep(between);
		this.view.css("transform", "rotate(-" + deg + "deg)");
		await sleep(between);
		this.view.css("transform", "rotate(" + deg + "deg)");
		await sleep(between);
		this.view.css("transform", "rotate(-" + deg + "deg)");
		await sleep(between);
		this.view.css("transform", "");
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
		this.container = $(".viewport");
		this.container.html("");
		let width = this.container.css("width");
		let height = this.container.css("height");
		this.layer = new Layer("canvas", 1);
		this.layer.content("<canvas width='" + width + "' height='" + height + "'></canvas>");
		this.element = document.querySelector("canvas");
		this.canvas = this.element.getContext("2d");
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
		// rAF(this.loop);
	}
}

class Layer {
	constructor(name, index, align = "middle-center") {
		if ($("div.layer[name='" + name + "']").length === 0) {
			this.id = make_id();
			this.name = name;
			if (!layers[name]) {
				layers[name] = parseInt(index);
			}
			if (align) {
				align = "align-" + align;
			}
			$(".viewport").append("<div class='layer " + align + "' name='" + name + "' id='" + this.id + "' style='z-index:" + (1 + layers[name]) + "'><div></div></div>");
		} else {
			this.id = $("div.layer[name='" + name + "']").attr("id");
		}
		this.element = $(".layer#" + this.id + " > div");
	}

	align(direction) {
		this.element.parent().attr("class", "layer align-" + direction);
	}

	content(html) {
		this.element.html(html);
	}

	add(html, prepend = false) {
		if (prepend === false) {
			this.element.append(html);
		} else {
			this.element.prepend(html);
		}
	}

	remove(selector) {
		this.element.find(selector).remove();
	}
}
