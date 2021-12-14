/* Keyboard Support
*
* Add this to your project if you would like to support keyboards
* */

let keyboard;

// const keyMap = {
// 	"ctrl",
// 	"shift",
// 	"w",
// 	"a",
// 	"s",
// 	"d"
// };

if (!("keyboardPlugin" in navigator && "lock" in navigator.keyboard)) {
	console.warn("Keyboard Plugin", "Keyboard access seems to be restricted or unsupported by this browser.", navigator.keyboard);
} else {
	keyboard = navigator.keyboard;
}

class Keyboard {
	on(keys, state, callback) {
		if (!Array.isArray(keys)) {
			console.error("Keyboard.on()", "Keys must be specified as an Array (eg. ['z']).", keys);
			return;
		}
		if (keys.length === 0) {
			console.error("Keyboard.on()", "No keys specified, Array is empty.", keys);
			return;
		}
		// keys.forEach(function (key) {
		// 	if (!(button in keyMap)) {
		// 		console.error("Gamepad.on()", "Unknown key '" + button + "'. See 'keyMap'.", this);
		// 		return;
		// 	}
		// });
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
}