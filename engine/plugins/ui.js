/*
* UI Plugin
*
* Draw UI (text, menus, inputs etc.) on the screen
* */

$(function () {
	canvas_extensions.push(drawText);
	canvas_extensions.push(drawMenus);
});

/* Text */

let ui_text = [];

async function drawText() {
	ui_text.forEach(function (txt) {
		let txt_x = txt.x;
		let txt_y = txt.y;
		ctx.font = `${txt.size}px '${txt.font}'`;
		if (txt.align) {
			ctx.textAlign = txt.align;
		}
		if (txt.direction) {
			ctx.direction = txt.direction;
		}
		if (txt.color) {
			ctx.fillStyle = txt.color;
		} else if (!txt.stroke) {
			ctx.fillStyle = "black";
		}
		if (txt.position) {
			let position = txt.position.split(" ");
			let y = position[0];
			let x = position[1];
			ctx.textAlign = x;
			ctx.textBaseline = y;
			switch (y) {
				case "top":
					txt_y = 16 + txt.y;
					break;
				case "middle":
					txt_y = (config.viewport.height / 2) + txt.y;
					;
					break;
				case "bottom":
					txt_y = 16 + txt.y;
					break;
			}
			switch (x) {
				case "left":
					txt_x = 0 + txt.x;
					break;
				case "center":
					txt_x = (config.viewport.width / 2) + txt.x;
					break;
				case "right":
					txt_x = config.viewport.width + txt.x;
					break;
			}
		}
		if (txt.stroke) {
			if (txt.stroke.width) {
				ctx.strokeWidth = txt.stroke.width;
			}
			if (txt.stroke.color) {
				ctx.strokeColor = txt.stroke.color;
			}
			if (!txt.width) {
				ctx.strokeText(txt.content, txt_x, txt_y);
			} else {
				ctx.strokeText(txt.content, txt_x, txt_y, txt.width);
			}
		} else {
			if (!txt.width) {
				ctx.fillText(txt.content, txt_x, txt_y);
			} else {
				ctx.fillText(txt.content, txt_x, txt_y, txt.width);
			}
		}
	});
}

// origin = x: 0, y: 16
class Text {
	constructor(options) {
		if (!options.content) return;
		this.content = options.content;
		this.color = (colors[options.color]) ? colors[options.color] : options.color;
		this.type = (options.type) ? options.type : false;
		this.font = (options.font) ? options.font : config.font;
		this.size = (options.size) ? options.size : 16;
		this.x = (options.x) ? parseInt(options.x) : 0;
		this.y = (options.y) ? parseInt(options.y) : 0;
		(options.position) ? this.position = options.position : null;
		this.flashInterval = (this.flashInterval) ? options.flashInterval : null;
		this.show();
		if(options.flashing === true) {
			this.flash();
		}
	}

	flash(seconds = .5, times = 0) {
		seconds = seconds * 1000;
		let show = false;
		let this_text = this;
		this.flashInterval = setInterval(function() {
			if(show === true) {
				this_text.show();
				show = false;
			} else {
				this_text.hide();
				show = true;
			}
			if(times !== 0) {
				if (times === 1) {
					this_text.stopFlash();
				}
				--times;
			}
		},seconds);
	}

	stop() {
		clearInterval(this.flashInterval);
	}

	show() {
		ui_text.push(this);
	}

	hide() {
		let i = ui_text.indexOf(this);
		if(i > -1) {
			ui_text.splice(i,1);
		}
	}
}

/* Menus */

let ui_menus = [];

async function drawMenus() {
	ui_menus.forEach(function(menu) {

	});
}

class Menu {
	constructor() {

	}
	show() {

	}
	hide() {

	}
}