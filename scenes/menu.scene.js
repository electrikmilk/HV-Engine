let scene = new Scene();

let music = new Audio({
	src: "example/music.mp3",
	channel: "music"
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