let menu_scene = new Scene();

$(function() {
	menu_scene.start();
	let music = new Audio({
		src: "example/music.wav",
		channel: "music",
		autoplay: true
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
});