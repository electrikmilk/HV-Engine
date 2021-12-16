/* Example game script */

let scenes = [
	"menu",
	"chapter1/act1"
];

let plugins = [
	"keyboard",
	"storage",
	"ui",
	"audio"
];

let game = new Game(scenes, plugins);

game.view("640px", "480px");

