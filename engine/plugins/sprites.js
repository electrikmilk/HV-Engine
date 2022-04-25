/*
* Sprites Plugin
*
* Draws sprites on the screen, handles collision
* */

let sprites = [];

$(function () {
	canvas_extensions.push(drawSprites);
});

async function drawSprites() {
	sprites.forEach(function (sprite) {
		if (sprite.image) {
			ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height);
		} else {
			ctx.fillStyle = sprite.color;
			if (sprite.shape === "rectangle") {
				ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
			} else {
				ctx.beginPath();
				ctx.arc(sprite.x, sprite.y, 70, 0, 2 * Math.PI, false);
			}
		}
	});
}

function circleCollision(object1, object2) {
	let x_distance = object2.x - object1.x;
	let y_distance = object2.y - object1.y;
	return Math.sqrt(Math.pow(x_distance, 2) + Math.pow(y_distance, 2)) < (object1.radius || object2.radius);
}

function boxCollision(object1, object2) {
	if (
		object1.x + object1.width >= object2.x &&
		object1.x <= object2.x + object2.width &&
		object1.y + object1.height >= object2.y &&
		object1.y <= object2.y + object2.height
	)
		return true;
}

function colliding(object1, object2) {
	if (object1.shape === "circle" && object2.shape === "circle") {
		if (circleCollision(object1, object2) === true) {
			return true;
		}
		return false;
	} else if (object1.shape === "rectangle" && object2.shape === "rectangle") {
		if (boxCollision(object1, object2) === true) {
			return true;
		}
		return false;
	}
}

class Sprite {
	constructor(options) {
		this.name = (options.name) ? options.name : `Sprite ${sprites.length + 1}`;
		this.color = (colors[options.color]) ? colors[options.color] : options.color;
		if (options.image) {
			this.image = new Image();
			this.image.src = options.image;
		}
		this.x = (options.x) ? parseInt(options.x) : 0;
		this.y = (options.y) ? parseInt(options.y) : 0;
		this.width = parseInt(options.width);
		this.height = parseInt(options.height);
		this.solid = (options.solid) ? options.solid : false;
		this.shape = (options.shape) ? options.shape : "rectangle";
		this.radius = (options.radius) ? options.radius : 70;
		this.bound = (options.bound) ? options.bound : true;
		sprites.push(this);
	}

	move(direction, amount) {
		let new_x = this.x;
		let new_y = this.y;
		let next_x = this.x;
		let next_y = this.y;
		switch (direction) {
			case "up":
				new_y -= amount;
				next_y -= amount - amount;
				break;
			case "left":
				new_x -= amount;
				next_x -= amount - amount;
				break;
			case "right":
				new_x += amount;
				next_x += amount + amount;
				break;
			case "down":
				new_y += amount;
				next_y += amount + amount;
				break;
		}
		// collision
		let is_colliding = false;
		if (this.solid === true) {
			let new_position = {
				x: next_x,
				y: next_y,
				width: this.width,
				height: this.height,
				shape: this.shape
			};
			let this_sprite = this;
			sprites.forEach(function (sprite) {
				if (sprite.solid === true && sprite !== this_sprite) {
					if (colliding(new_position, sprite) === true) {
						is_colliding = true;
					}
				}
				return true;
			});
			// bound to viewport
			if (this.bound === true) {
				let bound_x = new_x + this.width - amount;
				let bound_y = new_y + this.height - amount;
				if (bound_x >= config.viewport.width || bound_y >= config.viewport.height) {
					is_colliding = true;
				}
				if (next_x === 0 || next_y === 0) {
					is_colliding = true;
				}
			}
		}
		// We aren't colliding with anything solid, go ahead and move to the next position
		if (is_colliding === false) {
			this.x = new_x;
			this.y = new_y;
		}
	}
}