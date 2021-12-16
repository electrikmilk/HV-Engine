/*
* Keyboard Plugin
*
* Add this to your project if you would like to support keyboard input
* Mainly uses the Mousetrap library for its functionality, visit craig.is/killing/mice for details
* */

let keyboard;

if (!("keyboardPlugin" in navigator && "lock" in navigator.keyboard)) {
	console.warn("Keyboard Plugin", "Keyboard access seems to be restricted or unsupported by this browser.", navigator);
} else {
	keyboard = navigator.keyboard;
}

class Keyboard {

	// Setup triggers
	on(keys, state, callback) {
		if (!Array.isArray(keys)) {
			console.error("Keyboard.on()", "Keys must be specified as an Array (eg. ['z']).", keys);
			return;
		}
		if (keys.length === 0) {
			console.error("Keyboard.on()", "No keys specified, Array is empty.", keys);
			return;
		}
		switch (state) {
			case "pressed":
				state = "keypress";
				break;
			case "held":
				state = "keydown";
				break;
			case "released":
				state = "keyup";
				break;
			default:
				state = null;
		}
		Mousetrap.bind(keys.join("+"), function (e) {
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				// internet explorer
				e.returnValue = false;
			}
			if (callback) {
				callback(e);
			}
		}, state);
	}

	// Trigger key press
	trigger(keys) {
		if (!Array.isArray(keys)) {
			console.error("Keyboard.trigger()", "Keys must be specified as an Array (eg. ['z']).", keys);
			return;
		}
		if (keys.length === 0) {
			console.error("Keyboard.trigger()", "No keys specified, Array is empty.", keys);
			return;
		}
		Mousetrap.trigger(keys.join("+"));
	}

	// Unbind triggers
	unbind(keys) {
		if (!Array.isArray(keys)) {
			console.error("Keyboard.unbind()", "Keys must be specified as an Array (eg. ['z']).", keys);
			return;
		}
		if (keys.length === 0) {
			console.error("Keyboard.unbind()", "No keys specified, Array is empty.", keys);
			return;
		}
		Mousetrap.unbind(keys.join("+"));
	}

	// Un-pause keyboard binds
	enable() {
		Mousetrap.unpause();
	}

	// Pause keyboard binds
	disable() {
		Mousetrap.pause();
	}

	// Reset all triggers
	reset() {
		Mousetrap.reset();
	}
}