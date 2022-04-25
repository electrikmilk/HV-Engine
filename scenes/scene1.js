let text;
let text2;

$(function () {
	Keyboard.on(["x"], "down", function () {
		Dialogue.clear();
	});
	let wall = new Sprite({
		name: "wall",
		color: "blue",
		x: 0,
		y: 50,
		width: 100,
		height: 480,
		solid: true
	});
	let player = new Sprite({
		name: "player",
		color: "red",
		x: 280,
		y: 200,
		width: 100,
		height: 100,
		solid: true
	});
	Keyboard.on(["up"], "down", function () {
		player.move("up", 10);
	});
	Keyboard.on(["left"], "down", function () {
		player.move("left", 10);
	});
	Keyboard.on(["right"], "down", function () {
		player.move("right", 10);
	});
	Keyboard.on(["down"], "down", function () {
		player.move("down", 10);
	});
	let header = new Sprite({
		color: "black",
		width: config.viewport.width,
		height: 50,
		solid: true
	});
	text = new Text({
		content: "YOU WIN!!!",
		// x: 0,
		// y: 16,
		color: "white",
		position: "middle center",
		flashing: true
	});
	text2 = new Text({
		content: "LIVES LEFT: 5",
		x: -15,
		y: 0,
		color: "white",
		position: "top right"
	});
	Keyboard.on(["z"], "pressed", function () {
		if (colliding(player, wall)) {
			Dialogue.new({
				text: "(It's just a wall.)"
			});
		}
	});
});