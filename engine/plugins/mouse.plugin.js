/*
* Mouse Plugin
*
* Add this to your project if you would like to support mouse input
* Adds click, hover and move mouse events to objects
* */

let Mouse = {
	move: function(callback) {
		$("body").on("mousemove",function(e) {
			callback(e.pageX,e.pageY);
		});
	}
};

Objects.prototype.click = function(callback) {
	if(callback) {
		this.element.on("click",function() {
			callback();
		});
	}
};

Objects.prototype.doubleClick = function(callback) {
	if(callback) {
		this.element.on("dblclick",function() {
			callback();
		});
	}
};

Objects.prototype.holdClick = function(callback) {
	if(callback) {
		this.element.on("mousedown",function() {
			callback();
		});
	}
};

Objects.prototype.releaseClick = function(callback) {
	if(callback) {
		this.element.on("mouseup",function() {
			callback();
		});
	}
};

Objects.prototype.enter = function(callback) {
	if(callback) {
		this.element.on("mouseenter",function() {
			callback();
		});
	}
};

Objects.prototype.leave = function(callback) {
	if(callback) {
		this.element.on("mouseleave",function() {
			callback();
		});
	}
};

Objects.prototype.hover = function(enter,leave) {
	if(enter) {
		this.element.on("mouseenter",function() {
			enter();
		});
	}
	if(leave) {
		this.element.on("mouseleave",function() {
			leave();
		});
	}
};