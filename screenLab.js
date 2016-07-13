(function(){

    "use strict";

    // Get HTML elements
    var sizes = document.querySelector('.sizes');

    // Init constants
    var RATIO_16_BY_9 = (16.0 / 9.0);
    var RATIO_3_BY_2 = (3.0 / 2.0);

    // Init vars
    var ratio = screen.width / screen.height;

    /*
     * Get data
     */
    getScreenData();
    getRatio();
    getOrientation();


    /*
     * Functions below
     */

    function getScreenData() {
        sizes.innerHTML = "screen width: " + screen.width
            + "\nscreen height: " + screen.height
            + "\n"
            + "\nwindow width: " + window.innerWidth
            + "\nwindow height: " + window.innerHeight;
    }

    function getRatio() {
        sizes.innerHTML += "\n\n"
            + "ratio: " + ratio.toFixed(5);

        if (ratio == RATIO_16_BY_9 || (1 / RATIO_16_BY_9)) {
            sizes.innerHTML += " (16:9)";
        } else if (ratio == RATIO_3_BY_2 || (1 / RATIO_3_BY_2)) {
            size.innerHTML += " (3:2)";
        }
    }

    function getOrientation() {
        sizes.innerHTML += "\norientation: ";
        if (screen.height > screen.width) {
            sizes.innerHTML += "portrait";
        } else if (screen.height < screen.width) {
            sizes.innerHTML += "landscape";
        } else {
            sizes.innerHTML += "square";
        }
    }

})();
