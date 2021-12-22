/* Example Scene */

let myscene = new MyScene();

$(function() {
	myscene.start();

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
});

class MyScene extends Scene {
	constructor() {
		super();
	}
	// runs every frame
	loop() {
		console.log("frame");
	}
}

