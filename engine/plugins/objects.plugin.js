/*
 * Game Objects
 * This plugin is required and loaded by default.
 */

class Objects {
	constructor(options) {
		if(!options) {
			return;
		}
		this.id = make_id();
		layers[1].object.add("<div class='object' id='"+this.id+"'></div>");
	}

	object() {
		return $("div.object#"+this.id);
	}

	set(key,value) {
		switch (key) {
			case "background":
				if(value.includes("/")) {
					// url
					this.object().css("background-image","url("+value+")");
				} else {
					// color
					if(!value.includes("#") && color_palette[value]) {
						value = color_palette[value];
					}
					this.object().css("background-color",value);
				}
				break;
			case "stroke":
				if(value.color) {
					let color = value.color;
					if(!color.includes("#") && color_palette[color]) {
						color = color_palette[color];
					}
					this.object().css("border-color",color);
				}
				if(value.width) {
					this.object().css("border-color",value.width.replace("px","")+"px");
				}
				break;
			case "rounding":
				this.object().css("border-radius",value.replace("px","")+"px");
				break;
			case "padding": {
				this.object().css("padding",value.replace("px","")+"px");
				break;
			}
			case "margin": {
				this.object().css("margin",value.replace("px","")+"px");
				break;
			}
			case "width": {
				this.object().css("width",value.replace("px","")+"px");
				break;
			}
			case "height": {
				this.object().css("height",value.replace("px","")+"px");
				break
			}
			default:
				break;
		}
	}
	get(key) {
		if(this.object().css(key)) {
			return this.object().css(key);
		}
	}
	effect(type) {
		switch (type) {
			case "":

				break;
		}
	}
}

class Sprite extends Objects {
	constructor(options) {
		super(options);
	}
	move(direction,amount) {
		let bound = super.object().getBoundingClientRect();
		if (super.object().withinParent()) {
			if (direction && amount) {
				console.log("moving sprite (" + this.id + ") " + amount + "px " + direction);
				switch (direction) {
					case "up":
						super.object().css("top", (bound.y - amount) + "px");
						break;
					case "left":
						super.object().css("top", (bound.y - amount) + "px");
						break;
					case "right":
						super.object().css("left", (bound.y + amount) + "px");
						break;
					case "down":
						super.object().css("top", (bound.y + amount) + "px");
						break;
					default:
						console.error("[Spite.move()]:","usage: move({up|left|right|down},{pixels})");
				}
			} else {
				console.error("[Spite.move()]:","usage: move({up|left|right|down},{pixels})");
			}
		} else {
			console.warn("[Spite.move()]:","Out of bounds");
		}
	}
}

class Text extends Objects {
	constructor(options) {
		super(options);
		super.set("padding","5px");
	}
	set(key,value) {
		super.set(key,value);
		switch (key) {
			case "text":
				if(super.object().find("p").length === 0) {
					super.object().prepend("<p>"+value+"</p>");
				} else {
					super.object().find("p").html(value);
				}
				break;
			case "title":
				if(super.object().find("h3").length === 0) {
					super.object().prepend("<h3>"+value+"</h3>");
				} else {
					super.object().find("h3").html(value);
				}
				break;
		}
	}
	get(key) {
		super.get(key);
		switch (key) {
			case "text":
				let text = super.object().find("p");
				if(text.length !== 0) {
					return text.html();
				} else {
					return false;
				}
				break;
			case "title":
				let title = super.object().find("h3");
				if(title.length !== 0) {
					return title.html();
				} else {
					return false;
				}
				break;
		}
	}
}