/*
* Gamepad Plugin
*
* Add this to your project if you would like to support gamepad input
* */

let gamepads = {}; // propagated with gamepad objects

if (!("getGamepads" in navigator)) {
	console.warn("Gamepad Plugin", "Gamepad access seems to be restricted or unsupported by this browser.", navigator);
}

/*
* Mix of Xbox/PlayStation control terms for simplicity.
* Using A-B-X-Y because it's more standardized, also alternately you'd need to specify "ax", "bo", etc. when they're equivalent
* Didn't use shorthand, so it's easier to remember and understand
*  */
const buttonIndex = {
	"a": "0", // X - cross
	"b": "1", // O - circle
	"x": "2", // □ - square
	"y": "3", // △ - triangle
	"left-shoulder": "4", // LB | L1
	"right-shoulder": "5", // RB | R1
	"left-trigger": "6", // LT | L2
	"right-trigger": "7", // RT | R2
	"options-left": "8", // share | view
	"options-right": "9", // options | menu
	"left-stick-down": "10", // Left-stick pressed
	"right-stick-down": "11", // Right-stick pressed
	"dpad-up": "12", // D-Pad
	"dpad-down": "13",
	"dpad-left": "14",
	"dpad-right": "15",
	"logo": "16", // Xbox, PlayStation logo buttons
	"left-stick": null,
	"right-stick": null
};

// const stickAxes = {
// 	"left": [0, 1],
// 	"right": [2, 3]
// };

// Handles gamepads being disconnected and reconnected
function gamepadHandler(event, connecting) {
	let gamepad = event.gamepad;
	// Note:
	// gamepad === navigator.getGamepads()[gamepad.index]
	if (connecting) {
		gamepads[gamepad.index] = gamepad;
		if (gamepad[gamepad.index].mapping !== "standard") {
			console.warn("gamepadHandler", "Gamepad " + gamepad.index + " does not have standard mapping. Controls may not work as expected.", gamepad[gamepad.index].mapping);
		}
	} else {
		delete gamepads[gamepad.index];
	}
}

window.addEventListener("gamepadconnected", function (e) {
	gamepadHandler(e, true);
	console.info("gamepadHandler", "Gamepad " + e.gamepad.index + " has been connected.", e);
}, false);
window.addEventListener("gamepaddisconnected", function (e) {
	gamepadHandler(e, false);
	console.warn("gamepadHandler", "Gamepad " + e.gamepad.index + " has been disconnected.", e);
}, false);

class Gamepad {
	constructor(player) {
		this.player = player;
		this.enabled = true;
	}

	on(buttons, state, callback) {
		if (!Array.isArray(buttons)) {
			console.error("Gamepad.on()", "Buttons must be specified as an Array (eg. ['a']).", buttons);
			return;
		}
		if (buttons.length === 0) {
			console.error("Gamepad.on()", "No buttons specified, Array is empty.", buttons);
			return;
		}
		buttons.forEach(function (button) {
			if (!(button in buttonIndex)) {
				console.error("Gamepad.on()", "Unknown button '" + button + "'. See 'buttonIndex'.", this);
				return;
			}
			if (callback) {
				setInterval(function () {
					if (this.enabled === true) {
						if (button === "left-stick" || button === "right-stick") {
							if (button === "left-stick") {
								let x = gamepads[this.player].axes[0];
								let y = gamepads[this.player].axes[1];
								switch (state) {
									case "up":
										if (y === -1) {
											callback();
										}
										break;
									case "left":
										if (x === -1) {
											callback();
										}
										break;
									case "down":
										if (y === 1) {
											callback();
										}
										break;
									case "right":
										if (x === 1) {
											callback();
										}
										break;
								}
							} else if (button === "right-stick") {
							}
						} else {
							if (gamepads[this.player].buttons[button].pressed) {
								callback();
							}
						}
					}
				}, 100);

			}
		});
	}

	stick(which) {
		if (which !== "left" || which !== "right") {
			return;
		}
		let x = gamepads[this.player].axes[0];
		let y = gamepads[this.player].axes[1];
		return {
			x: x,
			y: y
		};
	}

	status() {
		return gamepads[this.player].connected;
	}

	enable() {
		this.enabled = true;
	}

	disable() {
		this.enabled = false;
	}
}