/* Custom JS goes here */

$(function() {
  // Display.fullscreen(true);
  Engine.display.viewport({
    width: "640px",
    height: "480px"
  });
  let sprite = new Sprite({
    name: "MyCharacter"
  });
  // Engine.controls.keyboard("a", function(e) {
  //   Engine.display.shake();
  // });
  Engine.controls.keyboard("up", function(e) {
    console.log("move up");
    sprite.move("up", 5);
  });
  Engine.controls.keyboard("left", function(e) {
    console.log("move left");
    sprite.move("left", 5);
  });
  Engine.controls.keyboard("right", function(e) {
    console.log("move right");
    sprite.move("right", 5);
  });
  Engine.controls.keyboard("down", function(e) {
    console.log("move down");
    sprite.move("down", 5);
  });

});

$(window).on("load", function() {

});