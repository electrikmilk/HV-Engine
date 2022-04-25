/*
* Mouse Plugin
*
* Add this to your project if you would like to support mouse input
* Adds click, hover and move mouse events to objects
* */

// Init mouse object
let Mouse = {
	shape: 'square',
	width: 32,
	height: 32,
	x: 0,
	y: 0
};

$(function () {
	$("canvas").on("mousemove", function (e) {
		let offset = $(this).offset();
		Mouse.x = e.pageX - offset.left;
		Mouse.y = e.pageY - offset.top;
	});
});

Sprite.prototype.hover = function (callback) {
	if (callback) {
		if(colliding(Mouse,this)) {
			callback();
		}
	}
};

// let Mouse = {
// 	move: function (callback) {
// 		$("body").on("mousemove", function (e) {
// 			callback(e.pageX, e.pageY);
// 		});
// 	}
// };

// Objects.prototype.hover = function (enter, leave) {
// 	if (enter) {
// 		this.element.on("mouseenter", function () {
// 			enter();
// 		});
// 	}
// 	if (leave) {
// 		this.element.on("mouseleave", function () {
// 			leave();
// 		});
// 	}
// };