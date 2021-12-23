let menu_scene = new Scene();

$(function() {
	menu_scene.start();
	// let music = new Audio({
	// 	src: "example/music.wav",
	// 	channel: "music",
	// 	autoplay: true,
	// 	loop: true
	// });
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
				options.show();
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
	let options = new Menu([
		{
			label: "Sound",
			callback: function() {

			}
		},
		{
			label: "Back",
			callback: function() {
				menu.show();
			}
		}
	]);
	options.hide();
	menu.show();
});