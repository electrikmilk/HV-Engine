const version = "1.0.0";
let readyMessage = "HV-Engine (" + version + ") ready";

console.time(readyMessage);

let resources = {
	"frameworks": ["jquery", "jquery-ui", "mousetrap", "mousetrap-pause"],
	"styles": ["main", "ui"],
	"general": ["engine"] // loaded last intentionally
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
resources.forEach(function (group) {
	group.forEach(async function (resource) {
		const head = document.querySelector("head");
		if (group === "styles") {
			let element = document.createElement("link");
			element.rel = "stylesheet";
		} else {
			let element = document.createElement("script");
			element.type = "text/javascript";
			element.async = true;
		}
		if (group === "frameworks") {
			element.src = "/engine/" + group + "/" + resource + ".min.js";
		} else if (group === "plugins") {
			element.src = "/engine/" + group + "/" + resource + ".plugin.js";
		} else if (group === "styles") {
			element.href = "/engine/" + group + "/" + resource + ".css";
		} else {
			element.src = "/engine/" + resource + ".js";
		}
		head.appendChild(element);
		await sleep(1);
	});
});