/*
* Dialogue Plugin
*
* Draw dialogue box on the screen
* */

let current_dialogue = false;
let current_character = 0;
let current_line = 0;
let voices = [];

$(function() {
	voices['default'] = new Audio({
		src: 'engine/sfx/type2.wav',
		channel: 'voices',
	});
	canvas_extensions.push(drawDialogue);
});

let Dialogue = {
	new: function(options) {
		let this_dialogue = {};
		this_dialogue.text = options.text;
		this_dialogue.position = (options.position) ? options.position : 'bottom';
		this_dialogue.char = options.char;
		this_dialogue.speed = (options.speed) ? parseFloat(`0.${options.speed}`) : 0.10;
		this_dialogue.color = (options.color) ? options.color : 'white';
		this_dialogue.size = (options.size) ? options.size : '15';
		this_dialogue.font = (options.font) ? options.font : config.font;
		// set this instance as the current dialogue
		current_dialogue = this_dialogue;
		current_character = 0;
		current_line = 0;
	},
	clear: function() {
		current_dialogue = false;
		current_character = 0;
		current_line = 0;
	},
	load: function(file) {
		$.get(`dialogue/${file}.json`,function(lines,status,xhr) {
			if(status === "success") {

			} else {
				console.log("Dialog.load()","Unable to load dialogue JSON file");
			}
		});
	}
}

async function drawDialogue() {
	if (current_dialogue !== false) {
		let positions = {
			"top": {
				x: 20,
				y: 15,
				width: 600,
				height: 120
			},
			"bottom": {
				x: 20,
				y: 340,
				width: 600,
				height: 120
			}
		};
		let position = positions[current_dialogue.position];
		// background
		ctx.fillStyle = "black";
		ctx.fillRect(position.x, position.y, position.width, position.height);
		// border
		ctx.strokeStyle = "white";
		ctx.lineWidth = 5;
		ctx.strokeRect(position.x - 3, position.y, position.width + 6, position.height - 2);
		// text
		ctx.font = `${current_dialogue.size}px '${current_dialogue.font}'`;
		ctx.fillStyle = (colors[current_dialogue.color]) ? colors[current_dialogue.color] : current_dialogue.color;
		let lines = current_dialogue.text.split("\n");
		// let profile_x = 0;
		// let profile_y = 0;
		// let noprofile_x = 35;
		// let noprofile_y = 375;
		// default: 35, 375

		ctx.fillText(lines[current_line].substring(0, current_character), position.x + 15, position.y + 35);

		// iterate line
		if(lines[current_line].length === current_character-1 && current_line !== lines.length-1) {
			current_character = 0;
			++current_line;
		}

		// iterate character
		if (current_character !== lines[current_line].length + 1) {
			await sleep(current_dialogue.speed);
			if (lines[current_line].charAt(current_character) !== " ") {
				voices["default"].play();
			}
			++current_character;
		} else {
			voices["default"].pause();
		}
	}
}