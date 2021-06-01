// Simple JS Game Engine

let version = "alpha 0.1";

const init = {
  include: function(url) {
    if (url.includes("js")) {
      const head = document.getElementsByTagName('head')[0];
      const script = document.createElement('script');
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", url);
      head.appendChild(script);
    } else {
      const head = document.getElementsByTagName('head')[0];
      const stylesheet = document.createElement('link');
      stylesheet.setAttribute("rel", "stylesheet");
      stylesheet.setAttribute("href", url);
      head.appendChild(stylesheet);
    }
    console.log("loaded " + url + "...");
  }
};

init.include("engine/frameworks/jquery.min.js");

setTimeout(function() {
  // now we can use jquery
  init.include("engine/index.js");
  init.include("engine/index.css");
  // load in project files
  init.include("project.js");
  init.include("project.css");
}, 500);