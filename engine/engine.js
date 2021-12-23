let requestFullscreen;
let rAF = window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
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
	"pink":"#F28DB2",
	"red":"#F21D2F",
	"orange":"#F28907",
	"darkorange":"#A65E1F",
	"yellow":"#F2B807",
	"green":"#00CC00",
	"olive":"#8FA65D",
	"darkolive":"#384001",
	"seagreen":"#0BE0A8",
	"cyan":"#0CE6EA",
	"blue":"#527AF2",
	"darkblue":"#2D3CAD",
	"indigo":"#5F49F2",
	"purple":"#A85FD9",
	"darkpurple":"#582F68",
	"brown":"#A65E1F",
	"darkbrown":"#592202",
	"lightgrey":"#888888",
	"grey":"#555555",
	"darkgrey":"#333333",
	"black":"#121212"
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
	for(var layer in layers) {
		layers.object = new Layer(layer.name, layer.index, false);
	}
	$.get("engine/res/init.html",function(response,status,xhr) {
		if(status === "success") {
			$("body").html(response);
		} else {
			console.error("HV-Engine/document.ready","Could not load loading DOM",status,xhr);
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
		required_plugins.forEach(function(plugin) {
			if(!plugins.includes(plugin)) {
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
			$("body").html("<div class='container'><div class='viewport'><div class='scene-container'></div></div></div>");
			// Start scenes
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
			requestFullscreen = setInterval(function() {
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
		rAF(this.loop);
	}
}

class Layer {
	constructor(name, index, align = "middle-center") {
		this.id = make_id();
		if (!layers[name]) {
			layers[name] = parseInt(index);
		}
		if(align) {
			align = "align-"+align;
		}
		$(".scene-container").append("<div class='layer " + align + "' id='" + this.id + "' style='z-index:" + (1 + layers[name]) + "'><div></div></div>");
		this.element = $(".layer#" + this.id + " > div");
	}

	align(direction) {
		this.element.parent().attr("class","layer align-"+direction);
	}

	content(html) {
		this.element.html(html);
	}

	add(html,prepend = false) {
		if(prepend === false) {
			this.element.append(html);
		} else {
			this.element.prepend(html);
		}
	}

	remove(selector) {
		this.element.find(selector).remove();
	}
}
