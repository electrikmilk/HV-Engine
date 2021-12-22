/* Example game script */

let scenes = [
	"menu",
	"chapter1/act1",
	"chapter1/act2",
	"chapter1/act3"
];

let plugins = [
	"keyboard",
	"gamepad",
	"mouse",
	"storage",
	"audio",
	"ui"
];

let game = new Game(scenes, plugins);

game.viewport("640px", "480px");

