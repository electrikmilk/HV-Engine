let viewport = $(".viewport");
let scene = $(".scene");
let requestFullscreen;
let gamepad = true;
let keyboard = navigator.keyboard;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

// https://stackoverflow.com/a/30477171/1741683
$.fn.withinParent = function() {
  var left = $(this).offset().left;
  var top = $(this).offset().top;
  var right = left + $(this).width();
  var bottom = top + $(this).height();
  var pleft = $(this).parent().offset().left;
  var ptop = $(this).parent().offset().top;
  var pright = pleft + $(this).parent().width();
  var pbottom = ptop + $(this).parent().height();
  console.log(right);
  console.log(pright);
  return left > pleft && top > ptop && right < pright && bottom < pbottom;
}

let movement_keys = ["wasd", "arrowkeys"];
let gamepad_buttons = ["joysticks", "dpad"];

if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
  // Supported!
}

// map keys
let keymap = [];
let buttonmap = [];

// captures all key presses
// navigator.keyboard.lock();
// navigator.keyboard.unlock();

// captures specific keys
// await navigator.keyboard.lock([
//   "KeyW",
//   "KeyA",
//   "KeyS",
//   "KeyD",
// ]);

// document.addEventListener('keydown', (e) => {
//   // if ((e.code === 'KeyA') && !(event.ctrlKey || event.metaKey)) {
//   //   // Do something when the 'A' key was pressed, but only
//   //   // when not in combination with the command or control key.
//   // }
//   console.log("Pressed the '" + e.code + "' key.", event);
// });

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
  gamepad = true;
});

window.addEventListener("gamepaddisconnected", function(e) {
  console.log("Gamepad disconnected from index %d: %s",
    e.gamepad.index, e.gamepad.id);
  gamepad = false;
});

var gamepads = {};

function gamepadHandler(event, connecting) {
  var gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]
  if (connecting) {
    gamepads[gamepad.index] = gamepad;
  } else {
    delete gamepads[gamepad.index];
  }
}

window.addEventListener("gamepadconnected", function(e) {
  gamepadHandler(e, true);
}, false);
window.addEventListener("gamepaddisconnected", function(e) {
  gamepadHandler(e, false);
}, false);

const Engine = {
  display: {
    background: function(bg) {
      $("html,body").css("background", bg);
    },
    fullscreen: function(bool) {
      if (bool === true) {
        requestFullscreen = setInterval(function() {
          if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
            clearInterval(requestFullscreen);
          } else {
            let elem = document.documentElement;
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
              elem.msRequestFullscreen();
            }
          }
        }, 2500);
      } else {
        if (requestFullscreen) {
          clearInterval(requestFullscreen);
        }
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    viewport: function(set) {
      if (set === false) {
        viewport.css("width", "").css("height", "").css("background-color", "");
      } else if (set.constructor == Object) {
        if (set.width) viewport.css("width", set.width);
        if (set.height) viewport.css("height", set.height);
        if (set.background) viewport.css("background-color", set.background);
      }
    },
    shake: async function(deg = 5, between = 100) {
      viewport.css("transform", "rotate(" + deg + "deg)");
      await sleep(between);
      viewport.css("transform", "rotate(-" + deg + "deg)");
      await sleep(between);
      viewport.css("transform", "rotate(" + deg + "deg)");
      await sleep(between);
      viewport.css("transform", "rotate(-" + deg + "deg)");
      await sleep(between);
      viewport.css("transform", "");
    }
  },
  sound: {
    load: function(url) {
      return new Audio(url);
    }
  },
  controls: {
    status: function(bool) { // enable/disable controls for a cutscene, etc.
      // tba...
    },
    keyboard: function(key, callback) {

      document.addEventListener('keydown', (e) => {
        // if ((e.code === 'KeyA') && !(event.ctrlKey || event.metaKey)) {
        //   // Do something when the 'A' key was pressed, but only
        //   // when not in combination with the command or control key.
        // }
        let code = e.code;
        let trigger = false;
        let directions = ["up", "left", "right", "down"];
        if (key === "meta" && event.metaKey) {
          trigger = true;
        } else if (key === "ctrl" && event.ctrlKey) {
          trigger = true;
        } else if (key.length === 1) {
          key = "Key" + key.toUpperCase();
        } else if (directions.includes(key)) {
          key = "Arrow" + capitalize(key);
        }
        if (callback && (key === e.code || trigger === true)) {
          console.log(key);
          callback(e);
        }
      });
    },
    gamepad: function(button, callback) {
      // tba...
    }
  }
};

class Sprite {
  constructor(options) {
    let id = guidGenerator();
    scene.append("<div class='sprite' id='" + id + "'></div>");
    this.element = document.getElementById(id);
    this.id = id;
    if (options) {
      let bound = this.element.getBoundingClientRect();
      this.options = options;
      if (this.options.name) this.name = this.options.name;
      if (this.options.width) $(this.element).css("width", this.options.width);
      if (this.options.height) $(this.element).css("height", this.options.height);
      // if (this.options.center === true) {
      //   $(this.element).css("top", ($(this.element).offset().top - $(this.element).parent().offset().top) + $(this.element).height() / 2);
      //   $(this.element).css("left", ($(this.element).offset().left - $(this.element).parent().offset().left) + $(this.element).width() / 2);
      // }
      var y = window.innerHeight - viewport.height();
      var x = window.innerWidth - viewport.width();
      if (this.options.x) $(this.element).css("top", y + this.options.y + "px");
      if (this.options.y) $(this.element).css("left", x + this.options.x + "px");
      if (this.options.z) $(this.element).css("z-index", this.options.z);
      if (this.options.background) $(this.element).css("background", this.options.background);
    }
  }
  move(dir, amt) {
    let bound = this.element.getBoundingClientRect();
    if ($(this.element).withinParent()) {
      if (dir && amt) {
        console.log("moving sprite (" + this.id + ") " + amt + "px " + dir);
        switch (dir) {
          case "up":
            $(this).css("top", (bound.y - amt) + "px");
            break;
          case "left":
            $(this).css("top", (bound.y - amt) + "px");
            break;
          case "right":
            $(this).css("left", (bound.y + amt) + "px");
            break;
          case "down":
            $(this).css("top", (bound.y + amt) + "px");
            break;
          default:
            console.error("usage: move(direction,amount)");
        }
      } else {
        console.error("usage: move(direction,amount)");
      }
    } else {
      console.log("move: out of bounds");
    }
  }
  set(option, value) {
    if (option && value) {
      this.options[option] = value;
      let bound = this.element.getBoundingClientRect();
      if (this.options.name) this.name = this.options.name;
      if (this.options.x) $(this.element).css("top", bound.y + this.options.y + "px");
      if (this.options.y) $(this.element).css("left", bound.x + this.options.x + "px");
      if (this.options.z) this.element.style.zIndex = this.options.z;
      if (this.options.width) this.element.style.width = this.options.width;
      if (this.options.height) this.element.style.height = this.options.height;
      if (this.options.background) this.element.style.background = this.options.background;
    }
  }
  get(option) {
    if (this.options[option]) {
      return this.options[option];
    } else {
      return false;
    }
  }
  flash() {

  }
  destroy() {
    this.element.remove();
    delete this;
  }
}

class Menu {
  constructor() {

  }
  show() {

  }
  hide() {

  }
  destroy() {

  }
}

class Letter {
  constructor(name) {

  }
}

class Combination {
  constructor() {

  }
}

class Audio {
  constructor(url) {

  }
}