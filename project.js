/* Custom JS goes here */

$(function() {
  // Display.fullscreen(true);
  Engine.display.viewport({
    width: "640px",
    height: "480px"
  });
  let sprite = new Sprite({
    name: "MyCharacter",
    x: 20,
    y: 20
  });
  // Engine.controls.keyboard("a", function(e) {
  //   Engine.display.shake();
  // });
  Engine.controls.keyboard("w", function(e) {
    sprite.move("up", 5);
  });
  Engine.controls.keyboard("a", function(e) {
    sprite.move("left", 5);
  });
  Engine.controls.keyboard("d", function(e) {
    sprite.move("right", 5);
  });
  Engine.controls.keyboard("s", function(e) {
    sprite.move("down", 5);
  });
});

$(window).on("load", function() {

});