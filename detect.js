/*
 * File: detect.js
 * Author: Zachary Liou 
 * Date created: 2016 July 11
 * Description: Prototype for device detection file.
 */


(function() {

    "use strict";


    /*
     * Init constants
     */
    // Detection vars
    var TIME_LIMIT      = 500;
    var TIME_LIMIT_IOS  = 950;
    var CHECKED         = false;
    var IS_MOBILE       = false;
    var DEBUG           = true;
                        
    // Confidence vars and constants
    var CONFIDENCE  = 0;
    var CONFIDENCE_THRESHOLD = 60;

    var GYRO_CONF       = 70;   // Does the device have a gyro?
    var ROTATE_CONF     = 70;   // Did the gyro's xyz values change?
    var TOUCH_CONF      = 10;   // Was there a touch event?
    var BATTERY_CONF    = 20;   // Does the device have a battery?
    var CHARGING_CONF   = -140; // Is the device plugged in?
    var SCREEN_CONF     = -10;  // Is the screen's aspect ratio NOT (16:9 or 3:2)?
    var PORTRAIT_CONF   = 40;   // Is the screen longer than it is wide?
                        
    // Screen constants
    var RATIOS = [
        (16.0 / 9.0),       // 16:9
        (568.0 / 320.0),    // iPhone 5
        (375.0 / 667.0),    // iPhone 6
        (3.0 / 2.0),        // iPhone 4
        (414.0 / 736.0),    // iPhone 6 Plus
    ];  

    // UA string keywords
    var KEYWORDS = [
        "Macintosh",
        "Ubuntu"
    ];

    // Language - detect as clean mobile ONLY for these languages
    var LANGUAGE = [
        "en-us",
        "en",
    ]


    if (DEBUG) {
        console.time("to-timer-start"); // TEST
        console.log(navigator);
        var start = Date.now();

        // DEBUG
        var sizes = document.querySelector('.sizes');
        var score = document.querySelector('.long-guess');
    }

    
    /*
     * Init vars, flags, and listeners
     */
    // Detection flags
    var clicked = false;
    var hasBattery = false;
    var hasCommonScreenSize = false;
    var hasGyro = false;
    var hasKeyword = false;
    var hasLanguage = false;
    var isCharging = false;
    var isBatteryFull = false;
    var mouseover = false;
    var portrait = false;
    var rotated = false;
    var scrolled = false;
    var touched = false;


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
    var timeLimit = uaContainsIOS() ? TIME_LIMIT_IOS : TIME_LIMIT;
    var timeoutID = window.setTimeout(detectDevice, timeLimit);
    if (DEBUG) console.timeEnd("to-timer-start");  // TEST



    /*
     * Start detection procedure
     */
    navigator.getBattery().then(checkBattery);
    checkLanguage();
    checkUserAgent();
    checkScreenData();



    // detectDevice will then execute after the time limit


////////////////////////////////////////////////////////////////////////


    /*
     * Functions
     */
     function debug() {

        console.timeEnd("to-timer-start");

        if (hasKeyword) score.innerHTML += "<br/><br/>KEYWORD ";
        if (clicked) score.innerHTML += "CLICK ";
        if (scrolled) score.innerHTML += "SCROLL ";
        if (mouseover) score.innerHTML += "MOUSE_MOVE ";
        if (isBatteryFull) score.innerHTML += "BATTERY_FULL";
        if (!hasLanguage) score.innerHTML += "NO_TARGET_LANG";

        // TEST - print confidence levels
        score.innerHTML += "<br/>- - - - - - - -";
        score.innerHTML += "<br/>CONFIDENCE: " + CONFIDENCE;
        score.innerHTML += "<br/>THRESHOLD:  " + CONFIDENCE_THRESHOLD;
        score.innerHTML += "<br/><br/>";

        // Print flag info (for testing)
        if (hasGyro)    score.innerHTML += "<br/><br/>GYRO_CONF:    " + GYRO_CONF;
        else            score.innerHTML += "<br/>no gyro ";
        if (rotated)    score.innerHTML += "<br/>ROTATE_CONF   " + ROTATE_CONF;
        else            score.innerHTML += "<br/>no rotation ";
        if (touched)    score.innerHTML += "<br/>TOUCH_CONF    " + TOUCH_CONF;
        else            score.innerHTML += "<br/>no touch ";
        if (hasBattery) score.innerHTML += "<br/>BATTERY_CONF  " + BATTERY_CONF;
        else            score.innerHTML += "<br/>no battery ";
        if (isCharging) score.innerHTML += "<br/>CHARGING_CONF " + CHARGING_CONF;
        else            score.innerHTML += "<br/>no charge state ";
        if (!hasCommonScreenSize) score.innerHTML   += "<br/>SCREEN_CONF   " + SCREEN_CONF;
        else            score.innerHTML += "<br/>no uncommon screen size ";
        if (portrait)   score.innerHTML += "<br/>PORTRAIT_CONF " + PORTRAIT_CONF;
        else            score.innerHTML += "<br/>no portrait orientation ";

        // TEST - print confidence levels
        score.innerHTML += "<br/>- - - - - - - -";
        score.innerHTML += "<br/>CONFIDENCE:   " + CONFIDENCE;
        score.innerHTML += "<br/>THRESHOLD:    " + CONFIDENCE_THRESHOLD;

        // DEBUG - display screen data
        sizes.innerHTML = "screen width: " + screen.width
            + "\nscreen height: " + screen.height
            + "\n"
            + "\nwindow width: " + window.innerWidth
            + "\nwindow height: " + window.innerHeight + "\n";
        sizes.innerHTML += "\nratio: " + (screen.width / screen.height);

        sizes.innerHTML += "\n" + navigator.language + "\n" + navigator.language.toLowerCase() + "\n";
        sizes.innerHTML += "lower: " 
            + navigator.language == navigator.language.toLowerCase();
     }



    function detectDevice() {
        if (!CHECKED) {
            CHECKED = true;
            checkFlags();
            if (DEBUG) debug();
            decide();
        }
    }


    function checkFlags() {
    
        if (hasKeyword || clicked || scrolled || mouseover || isBatteryFull || !hasLanguage) {
            CONFIDENCE = -1;
            if (!DEBUG) {
                return;
            }
        }

        if (hasGyro) CONFIDENCE += GYRO_CONF;
        if (rotated) CONFIDENCE += ROTATE_CONF;
        if (touched) CONFIDENCE += TOUCH_CONF;
        if (hasBattery) CONFIDENCE += BATTERY_CONF;
        if (isCharging) CONFIDENCE += CHARGING_CONF;
        if (!hasCommonScreenSize) CONFIDENCE += SCREEN_CONF; // note the !
        if (portrait) CONFIDENCE += PORTRAIT_CONF;

        return;
    }


    function decide() {
        IS_MOBILE = CONFIDENCE >= CONFIDENCE_THRESHOLD;
        if (!IS_MOBILE) console.log("a");
        if (DEBUG) {
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
    }


    function checkBattery(battery) {
        hasBattery = true;
        
        if (DEBUG) score.innerHTML += "<br/>TIME TO BATTERY: " + (Date.now() - start) + "<br/>";

        // Detect if initially charging
        if (battery.charging) {
            isCharging = true;
        }
        if (battery.level == 1) {
            isBatteryFull = true;
        } 
    }


    function checkUserAgent() {
        var uaString = navigator.userAgent;

        for (var i = 0; i < KEYWORDS.length; ++i) {
            if (~uaString.indexOf(KEYWORDS[i])) {
                hasKeyword = true;
                return;
            } 
        }   
    }


    function checkLanguage() {
        for (var i = 0; i < LANGUAGE.length; ++i) {
            if (LANGUAGE[i] == navigator.language.toLowerCase()) {
                hasLanguage = true;
                return;
            }
        }
    }


    function uaContainsIOS() {
        return ~navigator.userAgent.indexOf("iPhone");
    }


    function checkScreenData() {
        if (!screen.width || !screen.height) {
            if (DEBUG) sizes.innerHTML = "no screen data available.";
            hasCommonScreenSize = true;
            portrait = false;
            return;
        }

        // Calculate screen ratio
        var ratio = screen.width / screen.height;

        // Set flags
        for (var i = 0; i < RATIOS.length; ++i) {
            if (ratio == RATIOS[i] || ratio == (1 / RATIOS[i])) {
                hasCommonScreenSize = true;
                break;
            }
        }
        portrait = ratio < 1;
    }



    /*
    * Event handlers
    */
    function handleOrientation(event) {

        // if (DEBUG) score.innerHTML += "<br/>TIME TO GYRO: " + (Date.now() - start) + "<br/>";
        
        var absolute = event.absolute;
        var alpha    = event.alpha;
        var beta     = event.beta;
        var gamma    = event.gamma;

        // Check that gyro returns values
        if (alpha && beta && gamma) {
            hasGyro = true;

            console.log(gyroEnd - gyroStart);
            gyro.innerHTML = "gyro time: " + (gyroEnd - start);
                + "<br/>a: " + alpha
                + "<br/>b: " + beta
                + "<br/>g: " + gamma;

            // Set init gyro params if not already set
            if (!initAlpha || !initBeta || !initGamma) {
                initAlpha = alpha;
                initBeta = beta;
                initGamma = gamma;
            } else if (alpha != initAlpha || beta != initBeta || gamma != initGamma) {
                rotated = true;
            } // end else if 

        } else {
            gyro.innerHTML = "No gyro values detected.";
        }
        detectDevice();
    } // end handleOrientation


    function handleClick(event) {
        if (DEBUG) {
            console.log("click:"
                + "\nx: " + event.screenX 
                + "\ny: " + event.screenY
            );
        }

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
