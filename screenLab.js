(function(){

    "use strict";

    var sizes = document.querySelector('.sizes');

    // Get screen data
    sizes.innerHTML = "screen width: " + screen.width
        + "\nscreen height: " + screen.height
        + "\nwindow width: " + window.innerWidth
        + "\nwindow height: " + window.innerHeight;

})();
