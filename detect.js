/*
 * File: detect.js
 * Author: Zachary Liou * Date created: 2016 July 11
 * Description: Prototype for device detection file.
 */


(function() {

    var startTime = Date.now();

    /*
     * Init constants
     */
    // Detection vars
    var CONFIDENCE  = 0;
    var CONFIDENCE_THRESHOLD = 60;
    var TIME_LIMIT  = 200;
    var TIME_LIMIT_IOS = 950;
    var CHECKED     = false;
    var IS_MOBILE   = false;
                        
    // Confidence vars
    GYRO_CONF       = 70;
    ROTATE_CONF     = 70;
    TOUCH_CONF      = 70;
    BATTERY_CONF    = 20;
    CHARGING_CONF    = -25;
    SCREEN_CONF     = -20;
    PORTRAIT_CONF   = 25;
                        
    // Screen constants
    var RATIO_16_BY_9 = (16.0 / 9.0);
    var RATIO_3_BY_2 = (3.0 / 2.0);

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
    var hasCommonScreenSize = false;
    var portrait = false;
    var isCharging = false;
    var clicked = false;
    var scrolled = false;
    var rotated = false;
    var touched = false;
    var mouseover = false;

    // Other gyro vars
    var gyro = document.querySelector('.gyro');
    var initAlpha = null;
    var initBeta = null;
    var initGamma = null;

    // Add event listeners
    window.addEventListener("deviceorientation", handleOrientation, true);
    document.addEventListener("click", handleClick, false);
    document.addEventListener("wheel", handleWheel);
    document.addEventListener("mouseover", handleMouseover);
    document.addEventListener("touchstart", handleStart, false);

    // Timeout
    var timeout = uaContainsIOS ? TIME_LIMIT_IOS : TIME_LIMIT;
    var timeoutID = window.setTimeout(detectDevice, timeout);

    // DEBUG
    var score = document.querySelector('.long-guess');

    /*
     * Start detection procedure
     */
    navigator.getBattery().then(checkBattery);
    checkUserAgent();
    checkScreenData();

    // detectDevice will then execute after the time limit


////////////////////////////////////////////////////////////////////////


    /*
     * Functions
     */
    function detectDevice() {
        if (!CHECKED) {
            CHECKED = true;
            checkFlags();
            decide();
        }
    }


    function checkFlags() {
        if (hasKeyword || clicked || scrolled || mouseover) {
            CONFIDENCE = -1;
            
            if (hasKeyword) score.innerHTML += "KEYWORD ";
            if (clicked) score.innerHTML += "CLICK ";
            if (scrolled) score.innerHTML += "SCROLL ";
            if (mouseover) score.innerHTML += "MOUSE_MOVE ";

            return;
        }

        if (hasGyro) CONFIDENCE += GYRO_CONF;
        if (rotated) CONFIDENCE += ROTATE_CONF;
        if (touched) CONFIDENCE += TOUCH_CONF;
        if (hasBattery) CONFIDENCE += BATTERY_CONF;
        if (isCharging) CONFIDENCE += CHARGING_CONF;
        if (!hasCommonScreenSize) CONFIDENCE += SCREEN_CONF;
        if (portrait) CONFIDENCE += PORTRAIT_CONF;

        if (hasGyro) score.innerHTML += "GYRO_CONF ";
        else score.innerHTML += "no gyro ";
        if (rotated) score.innerHTML+= "ROTATE_CONF ";
        else score.innerHTML += "no rotation ";
        if (touched) score.innerHTML += "TOUCH_CONF ";
        else score.innerHTML += "no touch ";
        if (hasBattery) score.innerHTML += "BATTERY_CONF ";
        else score.innerHTML += "no battery ";
        if (isCharging) score.innerHTML += "CHARGING_CONF ";
        else score.innerHTML += "no charge state ";
        if (!hasCommonScreenSize) score.innerHTML += "SCREEN_CONF ";
        else score.innerHTML += "no common screen size ";
        if (portrait) score.innerHTML += "PORTRAIT_CONF ";
        else score.innerHTML += "no portrait orientation ";

        return;
    }


    function decide() {
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

    function uaContainsIOS() {
        return ~navigator.userAgent.indexOf("iPhone");
    }


    function checkScreenData() {

        // Calculate screen ratio
        var ratio = screen.width / screen.height;

        // Set flags
        hasCommonScreenSize = (
            ratio == RATIO_16_BY_9
            || ratio == (1 / RATIO_16_BY_9)
            || ratio == RATIO_3_BY_2
            || ratio == (1 / RATIO_3_BY_2)
        ); 
        portrait = ratio > 1;
    }



    /*
     * Event handlers
     */
    function handleOrientation(event) {
        
        var endTime = Date.now();
        score.innerHTML += "<br/>Time: " + (endTime - startTime) + "<br/>";

        var absolute = event.absolute;
        var alpha    = event.alpha;
        var beta     = event.beta;
        var gamma    = event.gamma;

        // Check that gyro returns values
        if (alpha != null && beta != null && gamma != null) {
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
        if (touched) { 
            return;
        } else {
            mouseover = true;
            detectDevice();
        }
    }


})();
