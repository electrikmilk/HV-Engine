![HV2D](https://i.imgur.com/40HNRIl.png)

# HV2D

HV2D is an easy-to-use HTML5 2D game engine. It contains useful abstractions for drawing shapes, text, and UI to the
canvas, reacting to keyboard, mouse, and gamepad input, calculating collisions between objects on the canvas, and
handling dialogue boxes.

It is currently a work in progress and tested locally rather than using a JavaScript module.

## 📦 Out of the box features

- 🎨 Direct access to canvas rendering loop. Grab the canvas context, clear the screen, pause the main draw loop, add to the draw loop, etc.
- ⏹️ Sprite abstraction (shadows, move, rotate, flash, gradient, background, etc.)
- 🐭 Canvas mouse abstraction
- 🔤 Easy keyboard abstraction
- 🎮 Gamepad support
- 🔊 Audio abstraction
- 💬 Dialogue boxes
- ⚽️ Physics
- 🐇 Animation

---

## Hello, world

You start your game by importing the `init()` function and giving it a configuration object and callback function to
call once the engine has set up the HTML body and canvas.

```javascript
import {init} from "./engine/init.js";

window.onload = () => {
    init({}, () => {
        // engine is ready.
        // ...
    });
};
```

### Drawing shapes and images

Drawing objects on the canvas is simple. Simply create a sprite, and give it a background color, size, etc.

```javascript
import {Sprite} from "./engine/sprite.js";

new Sprite({
    background: 'red',
    width: 100,
    height: 100
});
```

### Drawing Text

```javascript
const text = new Text({
    content: 'Use the arrow keys or WASD to move.',
    font: 'Helvetica',
    color: 'white',
    x: 15,
    y: 15,
    position: 'right top',
});
```

---

## Abstractions

### Keyboard

```javascript
import {Key} from "./engine/keyboard.js";

Key.pressed(['a'], () => {
    // ... 
});
```

---

### Mouse

```javascript
import {setCursor, hideCursor, toggleCursor, Mouse} from "./engine/mouse.js";

setCursor(); // show the cursor
setCursor('wait'); // set a specific cursor
hideCursor();
toggleCursor();

// Set a custom cursor
customCursor({
    color: 'red',
    width: 20,
    height: 20,
    image: './custom-cursor.png'
});

// Mouse events
Mouse.click((e) => {
    // ..
});
Mouse.clickEnd((e) => {
    // ..
});
Mouse.move((e) => {
    // ..
});

import {Sprite} from "./engine/sprite.js";

let sprite = new Sprite({})

// Sprite mouse events
sprite.click((e) => {
    // ..
});
sprite.clickEnd((e) => {
    // ..
});
sprite.clickOutside((e) => {
    // ..
});
sprite.hover((e) => {
    // ..
});
sprite.hoverEnd((e) => {
    // ..
});
```

---

## UI

HV2D comes with built-in canvas UI.

```javascript
const textbox = new Textbox({
    x: 15,
    y: 15,
    placeholder: 'Placeholder',
});

const button = new Button({
    x: 180,
    y: 15,
}).click(() => {
    button.setBackground('darkred');
}).clickEnd(() => {
    button.setBackground('red');
}).hover(() => {
    button.setBackground('red');
    button.setTextColor('white');
}).hoverEnd(() => {
    button.setBackground('white');
    button.setTextColor('black');
});
```

## Physics

HV2D comes with built-in physics algorithms for handling sprite collision.

You can do this automatically by moving sprites using the `Sprite.move()` method. This method will automatically check if the sprite is allowed to move in a direction by checking if it is colliding with any other solid sprites. Both sprites must have `solid` set to `true`.

```javascript
import {Sprite} from "./engine/sprite.js";

let sprite = new Sprite({
    solid: true
})

Key.pressed(['up'], () => {
    sprite.move('up', 10);
});
```

Check if two sprites are colliding manually or do some custom collision:

```javascript
import {colliding, circleCollision, boxCollision, circleBoxCollision} from "./engine/physics.js";
import {Sprite} from "./engine/sprite.js";

// Sprite collision

let sprite1 = new Sprite({
    solid: true
})
let sprite2 = new Sprite({
    shape: 'circle',
    solid: true
})

colliding(sprite1, sprite2)

// Custom collision detection
boxCollision(
        {
            x: 250,
            y: 180
        },
        {
            x: 250,
            y: 180
        }
);

circleCollision(
        {
            x: 100,
            y: 100,
            radius: 80
        },
        {
            x: 200,
            y: 200,
            radius: 50
        }
)
circleBoxCollision(
        // Circle
        {
            x: 100,
            y: 100,
            radius: 80
        },
        // Box
        {
            x: 250,
            y: 180,
            height: 100,
            width: 100
        }
)
```

*and more abstractions...*

---

## Helper functions

### Storage

Local storage helper functions that keep the type of the value intact.

```javascript
import {get, set, forget} from './engine/storage.js';

set('key', {test: true});
const object = get('key'); // {test: true}
object.test; // true (not "true")

set('key', 5);
get('key'); // 5 (not "5")

set('key', true);
get('key'); // true (not "true")

set('key', "string");
get('key'); // "string"

set('key'); // clear the value of the key
get('key') // null

forget('key'); // delete key-value pair
```

---

### Error handling

```javascript
const [result, error] = TRY(callFunction());
if (error) {
    // handle error
    throw new Error();
}

// use result
console.log(result);
```

Throw error when anything goes wrong within the call stack of a function.

```javascript
const result = MUST(callFunction());
```

---

### Misc.

Check if a value is completely and totally empty. Does multiple checks on the value to ensure it is actually empty and
not `0` or `false`.

```javascript
let value = 0;
empty(value); // false

value = false;
empty(value); // false

value = {};
empty(value); // true

value = undefined
empty(value); // true
```
