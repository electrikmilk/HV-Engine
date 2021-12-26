class MenuScene extends Scene {
	constructor() {
		super();
	}

	start() {
		this.canvas.beginPath();
		this.canvas.rect(20, 40, 50, 50);
		this.canvas.fillStyle = "#ff0000";
		this.canvas.fill();
		this.canvas.strokeStyle = "rgba(0, 0, 255, 0.5)";
		this.canvas.stroke();
		this.canvas.closePath();
	}
}

$(function () {
	// let music = new Audio({
	// 	src: "example/music.wav",
	// 	channel: "music",
	// 	autoplay: true,
	// 	loop: true
	// });
	let menu_scene = new MenuScene();
	menu_scene.start();
	let menu = new Menu([
		{
			label: "Start Game",
			callback: function () {
				game.load("chapter1/act1");
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
			callback: function () {

			}
		},
		{
			label: "Back",
			callback: function () {
				menu.show();
			}
		}
	]);
	options.hide();
	menu.show();
});