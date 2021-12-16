let scene = new Scene();

let music = new Audio({
	src: "example/tick.wav",
	channel: "sfx"
});

let menu = new Menu([
	{
		label: "Start Game",
		callback: function () {
			// do something
			console.log("start game");
		}
	}
]);