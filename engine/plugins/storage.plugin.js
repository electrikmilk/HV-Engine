/*
* Storage Plugin
*
* Add this to your project if you would like to use global variables across your scenes
* This makes it easier to use global variables across scenes.
* */

if (!window.localStorage) {
	console.warn("[Storage plugin]:", "The localStorage API is restricted or unsupported by this browser. Only Storage.session will work.", window);
}

let session = [];

let Storage = {
	// Temporary session storage
	session: {
		get: function (key) {
			if (session[key] !== undefined) {
				return session[key];
			} else {
				return false;
			}
		},
		set: function (key, value) {
			session[key] = value;
		},
		remove: function (key) {
			if (session[key] !== undefined) {
				const index = session.indexOf(key);
				if (index > -1) {
					session.splice(index, 1);
				}
			}
		},
		flush() {
			session = [];
		}
	},
	// Permanent local storage
	local: {
		get: function (key) {
			key = window.localStorage.getItem(key);
			if (key) {
				return key;
			} else {
				return false;
			}
		},
		set: function (key, value) {
			window.localStorage.setItem(key, value);
		},
		remove: function (key) {
			window.localStorage.removeItem(key);
		},
		flush() {
			window.localStorage.clear();
		}
	}
};