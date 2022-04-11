# HV2D

**Status: WIP**

HTML5 2D game engine

The focus of this engine is to enable the developer to develop 2D games for the browser with ease. The intention is to
not make the next great HTML5 2D game engine but just to make a game engine I'd like to use and maybe others would like
to use as well.

This project is in its early stages. I have yet to fully test all of its functions. I doubt you could make a very good game using it currently but my goal is to eventually get it to that point. 

## April 2022 Update

Starting to work on this engine again.

My plan is to redo most of the code, as when I started, I thought this could all be done using HTML elements but later realized the actual game would need to be drawn to a canvas.

Also, some stuff during the engine's initialization doesn't make any sense.

I'm hoping to have this engine actually working soon, with fixed example project that has a start menu, transitions to a basic scene with a background and a sprite that can walk around on that background.

### Structure

 - Scene
   - Layers
     - Foreground
       - Objects
     - Canvas
       - Sprites

### Plugins

Plugins are capabilities given to the scenes.

- Keyboard*
- Gamepad*

[*] Loaded by default if no plugins are specified

### Project Setup

To set up, add this repository to your project and name it something like `engine`. In your projects `index.html` file,
include the `init.js` file...

```html

<script async type="text/javascript" src="engine/init.js"></script>
```

Create a `project.js` file.

Create a `scenes` directory in your project. Add scenes to your game by creating files in this directory with the naming
convention `your_scene.scene.js`.

In `project.js`, define a game, and provide your scenes. Optionally, provide it with a second array that includes your
plugins.

```js
// The first member in the array is the first scene loaded
let scenes = [
	"your_scene",
	"your_scene2",
	"twistending"
];

// Plugins to load, overrides default plugins
let plugins = [
	"keyboard",
	"gamepad"
];

let myGame = new Game(scenes, plugins);
```

This will prompt the engine to load your first scene once it is ready. In your scene files is where you tell the engine
what you want it to do. You can load other scenes, create sprites, and more! Check the docs for more info on everything
a scene can tell the engine to do.
