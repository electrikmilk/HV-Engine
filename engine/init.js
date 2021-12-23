const version = "1.0.0";
let readyMessage = "HV-Engine (" + version + ") ready";
const head = document.querySelector("head");
let timeout = 1000;

let css = ["main", "ui"];
let resources = {
	"frameworks": ["jquery", "jquery-ui", "mousetrap", "mousetrap-pause"],
	"general": ["engine"],
	"project": ["project"]
};

window.onload = function() {
	console.log("window loaded");
	css.forEach(function(file) {
		let style = document.createElement("link");
		style.rel = "stylesheet";
		style.href = "engine/styles/"+file+".css";
		head.appendChild(style);
	});
};

async function sleep(s) {
	s = s * 1000;
	return new Promise(resolve => setTimeout(resolve, s));
}

function make_id(length = 6) {
	let result = "";
	let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	return result;
}

/* Load resources */

document.querySelector("img").onclick = function() {
	console.time(readyMessage);
	this.style.display = 'none';
	document.querySelector("#loading").style.display = 'block';
	for (var group in resources) {
		resources[group].forEach(function (resource) {
			let element;
			if (group === "styles") {
				element = document.createElement("link");
				element.rel = "stylesheet";
				timeout = 0;
			} else {
				element = document.createElement("script");
				element.type = "text/javascript";
				element.async = true;
				timeout = timeout + 500;
			}
			if (group === "frameworks") {
				element.src = "engine/" + group + "/" + resource + ".min.js";
			} else if (group === "plugins") {
				element.src = "engine/" + group + "/" + resource + ".plugin.js";
			} else if (group === "styles") {
				element.href = "engine/" + group + "/" + resource + ".css";
			} else if (group === "project") {
				element.src = "project.js";
			} else {
				element.src = "engine/" + resource + ".js";
			}
			setTimeout(function () {
				head.appendChild(element);
			}, timeout);
		});
	}
};
