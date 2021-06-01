let container = $(".output");
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
        container.css("width", "").css("height", "").css("background-color", "");
      } else if (set.constructor == Object) {
        if (set.width) container.css("width", set.width);
        if (set.height) container.css("height", set.height);
        if (set.background) container.css("background-color", set.background);
      }
    },
    shake: async function(deg = 5, between = 100) {
      container.css("transform", "rotate(" + deg + "deg)");
      await sleep(between);
      container.css("transform", "rotate(-" + deg + "deg)");
      await sleep(between);
      container.css("transform", "rotate(" + deg + "deg)");
      await sleep(between);
      container.css("transform", "rotate(-" + deg + "deg)");
      await sleep(between);
      container.css("transform", "");
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
        if (code === "up" || code === "left" || code === "right" || code === "down") {
          key = "Arrow" + capitalize(key);
          if (key === code) {
            trigger = true;
          }
        } else if (key === "meta" && event.metaKey) {
          trigger = true;
        } else if (key === "ctrl" && event.ctrlKey) {
          trigger = true;
        } else if (key.length === 1) {
          key = "Key" + key.toUpperCase();
          if (key === code) {
            trigger = true;
          }
        } else if (key === e.code) {
          trigger = true;
        }
        console.log(key);
        if (callback && trigger === true) {
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
    container.append("<div class='sprite' id='" + id + "'></div>");
    this.element = document.getElementById(id);
    this.id = id;
    if (options) {
      this.options = options;
      if (this.options.name) this.name = this.options.name;
      if (this.options.width) this.element.css("width", this.options.width);
      if (this.options.height) this.element.css("height", this.options.height);
      if (this.options.background) this.element.css("background", this.options.background);
    }
  }
  move(dir, amt) {
    let bound = this.element.getBoundingClientRect();
    switch (dir) {
      case "up":
        this.element.top = (bound.y - amt) + "px";
        break;
      case "left":
        this.element.left = (bound.x - amt) + "px";
        break;
      case "right":
        this.element.left = (bound.x + amt) + "px";
        break;
      case "down":
        this.element.top = (bound.y + amt) + "px";
        break;
      default:
        console.error("usage: move(direction,amount)");
    }
  }
  set(option, value) {
    if (option && value) {
      this.options[option] = value;
    }
  }
  destroy() {

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