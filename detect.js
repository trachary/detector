/*
 * File: detect.js
 * Author: Zachary Liou * Date created: 2016 July 11
 * Description: Prototype for device detection file.
 */


(function() {

    /*
     * Init constants
     */
    // Detection vars
    var IS_MOBILE   = false;
    var CONFIDENCE  = 0;
    var CONFIDENCE_THRESHOLD = 60;
    var TIME_LIMIT  = 200;
    var CHECKED     = false;
                        
    // Confidence vars
    GYRO_CONF       = 70;
    ROTATE_CONF     = 70;
    TOUCH_CONF      = 70;
    BATTERY_CONF    = 20;
    CHARGIN_CONF    = -25;
                        
    // UA string keywords
    var KEYWORDS = [
        "Macintosh",
        "Ubuntu"
    ];


    
    /*
     * Init vars, flags, and listeners
     */
    // Detection flags
    var hasKeyword = false;
    var hasGyro = false;
    var hasBattery = false;
    var isCharging = false;
    var clicked = false;
    var scrolled = false;
    var rotated = false;
    var touched = false;

    // Other gyro vars
    var initAlpha = null;
    var initBeta = null;
    var initGamma = null;

    // Add event listeners
    document.addEventListener("deviceorientation", handleOrientation, true);
    document.addEventListener("click", handleClick, false);
    document.addEventListener("wheel", handleWheel);
    document.addEventListener("mouseover", handleMouseover);
    document.addEventListener("touchstart", handleStart, false);

    // Timeout
    var timeoutID = window.setTimeout(detectDevice, TIME_LIMIT);



    /*
     * Start detection procedure
     */
    checkUserAgent();
    navigator.getBattery().then(checkBattery);

    // detectDevice will then execute after the time limit


////////////////////////////////////////////////////////////////////////


    /*
     * Functions
     */
    function detectDevice() {
        checkFlags();
        decide();
    }


    function checkFlags() {
        if (hasKeyword || clicked || scrolled) {
            CONFIDENCE = -1;
            return;
        }

        if (hasGyro) CONFIDENCE += GYRO_CONF;
        if (rotated) CONFIDENCE += ROTATE_CONF;
        if (touched) CONFIDENCE += TOUCH_CONF;
        if (hasBattery) CONFIDENCE += BATTERY_CONF;
        if (isCharging) CONFIDENCE -= CHARGING_CONF;

        return;
    }


    function decide() {
        CHECKED = true;
        IS_MOBILE = CONFIDENCE > CONFIDENCE_THRESHOLD;
        if (IS_MOBILE) {
            console.log("This is a clean mobile device!");
            // Do stuff
            document.getElementById("one").style.display = "block";
            document.getElementById("two").style.display = "none";
        } else {
            console.log("This is NOT a clean mobile device.");
            // Do other stuff
            document.getElementById("two").style.background = "#b30000";
        }
    }


    function checkBattery(battery) {
        hasBattery = true;

        // Detect if initially charging
        if (battery.charging) {
            isCharging = true;
        }
    }


    function checkUserAgent() {
        var uaString = navigator.userAgent;

        for (i = 0; i < KEYWORDS.length; ++i) {
            if (~uaString.indexOf(KEYWORDS[i])) {
                hasKeyword = true;
                return;
            } 
        }   
    }


    function checkScreenData() {
        console.log("screen width: " + screen.width
            + "\nscreen height: " + screen.height
            + "\nwindow width: " + window.innerWidth
            + "\nwindow height: " + window.innerHeight
        );;
    }



    /*
     * Event handlers
     */
    function handleOrientation(event) {
        var alpha    = event.alpha;
        var beta     = event.beta;
        var gamma    = event.gamma;

        // Check that gyro returns values
        if ((!rotated || !hasGyro) && alpha != null && beta != null && gamma != null) {
            hasGyro = true;

            // Set init gyro params if not already set
            if (initAlpha == null && initBeta == null && initGamma == null) {
                initAlpha = alpha;
                initBeta = beta;
                initGamma = gamma;
            } else if (alpha != initAlpha && beta != initBeta && gamma != initGamma) {
                rotated = true;
            } // end else if 

        } // end outer if
    } // end handleOrientation


    function handleClick(event) {
        console.log("click:"
            + "\nx: " + event.screenX 
            + "\ny: " + event.screenY
        );

        if (event.altKey || event.ctrlKey || event.metaKey) {
            // extra computer points
        }

        if (event.which == 2) {
            handleWheel();
        }
        detectDevice();
    }


    function handleWheel(event) {
        scrolled = true;
        detectDevice();
    }


    function handleStart(event) {
        touched = true;
        detectDevice();
    }


    function handleMouseover(event) {
        if (touched) return;
        else detectDevice();
    }


})();
