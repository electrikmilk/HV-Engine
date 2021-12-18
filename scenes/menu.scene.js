let scene = new Scene();

let music = new Audio({
	src: "example/music.mp3",
	channel: "music"
});

let player1 = new Gamepad(1);

player1.on(["a"],"press",function() {
	console.log("a");
});

Keyboard.on(["w"],"press",function() {
	console.log("pressed w");
});

Mouse.move(function(x,y) {
	// console.log(x,y);
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