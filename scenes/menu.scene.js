let scene = new Scene();

let music = new Audio({
	src: "example/music.wav",
	channel: "music",
	autoplay: true
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
			console.log("this would start the game");
		}
	},
	{
		label: "Options",
		callback: function () {
			// do something
			console.log("this would open another menu...?");
		}
	},
	{
		label: "Exit",
		callback: function () {
			// do something
			game.exit();
		}
	}
]);