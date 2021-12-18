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

// Plugin list
let active_plugins = [];

// Default layers
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
			$("body").html("<div class='container'><div class='viewport'><div class='scene-container'></div></div></div>");
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

class Objects {
	constructor(options) {
		if(!options) {
			return;
		}
		this.id = make_id();
		layers[1].object.add("<div class='object' id='"+this.id+"'></div>");
	}

	object() {
		return $("div.object#"+this.id);
	}

	set(key,value) {
		switch (key) {
			case "background":
				if(value.includes("/")) {
					// url
					this.object().css("background-image","url("+value+")");
				} else {
					// color
					this.object().css("background-color",value);
				}
				break;
			case "stroke":
				if(value.color) {
					this.object().css("border-color",value.color);
				}
				if(value.width) {
					this.object().css("border-color",value.width);
				}
				break;
			case "rounding":
				this.object().css("border-radius",value);
				break;
			case "padding": {
				this.object().css("padding",value);
				break;
			}
			case "margin": {
				this.object().css("margin",value);
				break;
			}
			case "width": {
				this.object().css("width",value);
				break;
			}
			case "height": {
				this.object().css("height",value);
				break
			}
			default:
				break;
		}
	}
	get(key) {

	}
	effect(type) {
		switch (type) {
			case "":

				break;
		}
	}
}

class Sprite extends Objects {
	constructor(options) {
		super(options);
	}
	move(direction,amount) {

	}
}

class Text extends Objects {
	constructor(options) {
		super(options);
		super.set("padding","5px");
	}
	set(key,value) {
		super.set(key,value);
		switch (key) {
			case "text":
				if(super.object().find("p").length === 0) {
					super.object().prepend("<p>"+value+"</p>");
				} else {
					super.object().find("p").html(value);
				}
				break;
			case "title":
				if(super.object().find("h3").length === 0) {
					super.object().prepend("<h3>"+value+"</h3>");
				} else {
					super.object().find("h3").html(value);
				}
				break;
		}
	}
	get(key) {
		super.get(key);
		switch (key) {
			case "text":
				let text = super.object().find("p");
				if(text.length !== 0) {
					return text.html();
				} else {
					return false;
				}
				break;
			case "title":
				let title = super.object().find("h3");
				if(title.length !== 0) {
					return title.html();
				} else {
					return false;
				}
				break;
		}
	}
}
