"use strict";

let canvas;
let ctx;
let raf;

let requestFullscreen;

let config = {
	background: {
		color: "darkgrey"
	},
	viewport: {
		width: 640,
		height: 480
	},
	font: "Helvetica",
	plugins: [
		"mouse",
		"keyboard",
		"audio",
		"ui",
		"storage",
		"dialogue"
	]
};

// Plugins
const required_plugins = ["sprites", "mouse", "keyboard"];

// Override default css colors, make the contrast less harsh
let colors = {
	"pink": "#f28db2",
	"red": "#d41c2b",
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

let canvas_extensions = [];

$(function () {
	console.timeEnd(readyMessage);
	// Progress bar
	$(".progress .determinate").css("width", "25%");
	$.get("engine/res/init.html", function (response, status, xhr) {
		if (status === "success") {
			$("body").html(response);
		} else {
			console.error("HV-Engine/document.ready", "Could not load loading screen", status, xhr);
		}
	});
});

class Game {
	constructor(options) {
		let status = $("p#status");
		let progress = $(".progress .determinate");
		status.text("Loading plugins...");
		progress.css("width", "50%");
		/* Config */
		// Font
		if (options.font) {
			config.font = options.font;
			Game.font(config.font);
		}
		// Viewport
		if (options.viewport) {
			config.viewport = options.viewport;
		}
		// Background
		if (options.background) {
			config.background = options.background;
		}
		// Scenes
		config.scenes = options.scenes;
		// Plugins
		required_plugins.forEach(function (plugin) {
			if (!options.plugins.includes(plugin)) {
				options.plugins.unshift(plugin);
			}
		});
		if (options.plugins) {
			config.plugins = options.plugins;
		}
		config.plugins.forEach(async function (plugin) {
			await Game.plugin(plugin);
		});
		progress.css("width", "100%");
		console.info("[Game.constructor()]:", "Loading finished.", options);
		// Start
		Scene.load(config.scenes[0]);
	}

	static async plugin(plugin) {
		$("head").append("<script type='text/javascript' id='" + plugin + "' src='engine/plugins/" + plugin + ".js'></script>\n");
		console.info("Game.plugin()", `Loaded plugin: ${plugin}`);
	}

	static font(name, wgts = "400;500;600;700") {
		if ($("link[font='" + name + "']").length === 0) {
			const url = "https://fonts.googleapis.com/css2?family=" + name.replace(" ", "+") + ":wght@" + wgts + "&display=swap";
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onreadystatechange = () => {
				if (xhr.readyState == 4 && xhr.status == 200) {
					let css = xhr.responseText;
					// css = css.replace(/}/g, 'font-display: swap; }');
					const head = document.getElementsByTagName("head")[0];
					const style = document.createElement("style");
					style.setAttribute("font", name);
					style.appendChild(document.createTextNode(css));
					head.appendChild(style);
				}
			};
			xhr.send();
		}
	}


}

class Scene {
	static load(scene) {
		Scene.pause();
		$("script#scene").remove();
		$.get("engine/res/scene.html", function (response, status, xhr) {
			if (status === "success") {
				$("body").html(response);
				canvas = document.querySelector("canvas");
				if (canvas.getContext) {
					ctx = canvas.getContext("2d");
				} else {
					console.error("<canvas> not supported!");
					window.stop();
				}
				$("head").append("<script type='text/javascript' id='scene' src='scenes/" + scene + ".js'></script>\n");
				console.info("Game.scene()", `Loaded scene: ${scene}`);
				Scene.start();
			} else {
				console.error("Game.scene()", "Could not load scene", status, xhr);
			}
		});
	}

	static start() {
		raf = window.requestAnimationFrame(Scene.draw);
	}

	static pause() {
		window.cancelAnimationFrame(raf);
	}

	// clear the canvas
	static clear() {
		ctx.clearRect(0, 0, 640, 480);
	}

	static composite(value) {
		// destination-over
		ctx.globalCompositeOperation = value;
	}

	// the main loop...
	static async draw() {
		Scene.clear();
		ctx.save();

		// Background
		if (config.background.color) {
			ctx.fillStyle = ((colors[config.background.color]) ? colors[config.background.color] : config.background.color);
			ctx.fillRect(0, 0, config.viewport.width, config.viewport.height);
		}
		if (config.background.image) {
			ctx.drawImage(config.background.image, 0, 0, config.viewport.width, config.viewport.height);
		}

		// Plugins
		for (const callback of canvas_extensions) {
			await callback();
		}

		ctx.restore();
		window.requestAnimationFrame(Scene.draw);
	}
}