let requestFullscreen;
let container = $(".output");

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    shake: async function(deg = 10, between = 100) {
      // transform: rotate(20deg);
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
  sound: function() {

  },
  controls: {
    set: function() {

    }
  }
};