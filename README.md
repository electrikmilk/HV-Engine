# HV Engine
HTML5 2D game engine

**Status: WIP**

The focus of this engine is to enable the developer to develop 2D games for the browser with ease. The intention is to not make the next great HTML5 2D game engine but just to make a game engine I'd like to use and maybe others would like to use as well.

### Plugins
Plugins are extensions of the engines' capabilities and are completely optional.
- Keyboard*
- Gamepad*

[*] Loaded by default if no plugins are specified

### Project Setup

To setup, add this repository to your project and name it something like `engine`.
In your projects `index.html` file, include the `init.js` file...
```html
<script async type='text/javascript' src='engine/init.js'></script>
```
Then also include a `project.js` file (or name it whatever you'd like), just make sure it's included after the `init.js` file.
```html
<script defer type='text/javascript' src='your_project.js'></script>
```
Create a `scenes` directory in your project. Add scenes to your game by creating files in this directory with the naming convention `your_scene.scene.js`.

In `project.js`, define a game, and provide your scenes. Optionally, provide it with a second array that includes your plugins.
```js
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

let myGame = new Game(scenes,plugins);
```
This will prompt the engine to load your first scene once it is ready. In your scene files is where you tell the engine what you want it to do. You can load other scenes, create spites, and more! Check the docs for more info on everything a scene can tell the engine to do.
