const version = "1.0.0";
let readyMessage = "HV-Engine (" + version + ") ready";

console.time(readyMessage);

let resources = {
	"frameworks": ["jquery", "jquery-ui", "mousetrap", "mousetrap-pause"],
	"general": ["engine"]
};

async function sleep(s) {
	s = s * 1000;
	return new Promise(resolve => setTimeout(resolve, s));
}

function make_id(length = 6) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	return result;
}

/* Load resources */
resources.forEach(function (group) {
	group.forEach(async function (resource) {
		const head = document.querySelector("head");
		let script = document.createElement("script");
		script.async = true;
		if (group === "frameworks") {
			script.src = "/engine/" + group + "/" + resource + ".min.js";
		} else if (group === "plugins") {
			script.src = "/engine/" + group + "/" + resource + ".plugin.js";
		} else {
			script.src = "/engine/" + resource + ".js";
		}
		script.type = "text/javascript";
		head.appendChild(script);
		await sleep(1);
	});
});