/*
 * Sprites
 *
 * Sprites are drawn onto the main scene layer and have collision detection.
 *
 * At the base of a scene is a main layer with a <canvas> element.
 * Create a Sprite to draw something onto that canvas (e.g. player, item, etc.)
 *
 * This plugin is required and loaded by default.
 */

class Sprite {
	constructor(scene, width, height, x = 0, y = 0) {
		this.scene = scene;
		this.x = x;
		this.y = y;
		this.image = new Image(width, height);
		this.image.onload = function () {
			this.scene.context.drawImage(this.image, this.x, this.y);
		};

	}

	set(key, value) {
		switch (key) {
			case "image":
				if (value) {
					this.image.src = value;
				}
				break;
			case "width":
				this.image.width = value.replace("px", "") + "px";
				break;
			case "height":
				this.image.height = value.replace("px", "") + "px";
				break;
			case "x":
				this.x = value;
				this.image.x = this.x;
				break;
			case "y":
				this.y = value;
				this.image.y = this.y;
				break;
		}
	}

	get(key) {
		if (key === "x" || key === "y") {
			if (key === "x") {
				return this.x;
			} else if (key === "y") {
				return this.y;
			}
		} else {
			let keyValue = Object.keys(this.image).find(key);
			if (keyValue) {
				return keyValue;
			}
		}
		return false;
	}

	move(direction, amount) {
		if(direction && amount) {
			switch(direction) {
				case "up":
					this.y += amount;
					break;
				case "left":
					this.x -= amount;
					break;
				case "right":
					this.x += amount;
					break;
				case "down":
					this.y -= amount;
					break;
				default:
					console.error("[Object.move()]:", "usage: move(up|left|right|down,(int)pixels)");
			}
			scene.canvas.width = scene.canvas.width;
			scene.context.drawImage(this.image, this.x, this.y);
		} else {
			console.error("[Object.move()]:", "usage: move(up|left|right|down,(int)pixels)");
		}
	}
}