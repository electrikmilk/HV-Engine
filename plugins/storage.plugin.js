/*
* Storage Plugin
*
* Add this to your project if you would like to use global variables across your scenes
* This makes it easier to use global variables across scenes.
* */

if(!window.localStorage) {
	console.warn("Storage plugin","localStorage unsupported.",window);
}

let session = [];

let Session = {
	get: function(key) {
		return session[key];
	},
	set: function(key,value) {
		session[key] = value;
	},
	remove: function(key) {
		const index = session.indexOf(key);
		if (index > -1) {
			session.splice(index, 1);
		}
	}
};

let Storage = {
	get: function(key) {
		key = window.localStorage.getItem(key)
		if (key) {
			return key;
		} else {
			return false;
		}
	}
	set: function(key,value) {
		window.localStorage.setItem(key,value);
	},
	remove: function(key) {
		window.localStorage.removeItem(key);
	}
};