let menu_scene = new Scene();

$(function() {
	// let music = new Audio({
	// 	src: "example/music.wav",
	// 	channel: "music",
	// 	autoplay: true,
	// 	loop: true
	// });
	menu_scene.start();
	let menu = new Menu([
		{
			label: "Start Game",
			callback: function () {
				Game.load("chapter1/act1");
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