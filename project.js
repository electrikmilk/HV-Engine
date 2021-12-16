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

let Game = new Game(scenes, plugins);

Game.view("640px", "480px");

