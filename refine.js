/* 
 * File: refine.js
 * Author: Zachary Liou
 * Date created: 2016 August 24
 * Description: refined/simplified version of lenient.js
 */



/*
 * Init vars
 */

// General detection vars
var IS_MOBILE       = false;
var DECIDED         = false;
var DEBUG_MODE      = true;

// Timing vars
var TIME_LIMIT 		= 10;
var TIME_BATTERY    = 75;
var TIME_GYRO_AND   = 300;
var TIME_GYRO_IOS   = 500;

// Detection mode flags
var MODE_BATTERY    = false;
var MODE_GYRO       = false;

// UA String flags
var UA_MOB          = false;
var UA_AND          = false;
var UA_IOS          = false;

// Battery flags
var BATT_ACCESS 	= false;
var BATT_FULL       = false;
var BATT_CHARGING   = false;

// Gyro flags
var GYRO_EXISTS 	= false;



/*
 * Begin detection procedure
 */

CONFIG = 3;
checkUAString();
setModes(CONFIG);       // CONFIG should be set by dz.php
setTimeLimit();       


if (MODE_GYRO) {
    window.addEventListener("deviceorientation", handleOrientation, true);
}

if (MODE_BATTERY) {
    navigator.getBattery().then(checkBattery);
}


/*
 * Functions below
 */

/*
 * 
 */
function setModes(config) {

    // Simple profile; also used for invalid or missing config param
    if (config == null || config <= 1) {
        MODE_BATTERY = true;
        MODE_GYRO = UA_AND;  // Use gyro only for Android

    // Advanced profile
    } else {
        var MASK_BATTERY = 2;
        var MASK_GYRO = 1;

        MODE_BATTERY = config & MASK_BATTERY;
        MODE_GYRO = config & MASK_GYRO;
    }

}




function checkBattery(battery) {
    BATT_ACCESS = true;
    BATT_CHARGING = battery.charging;
    BATT_FULL = battery.level == 1;
    if (DEBUG_MODE) {
        document.querySelector('.sizes').innerHTML += "\n\n" + (end - start) + "ms to battery\n";
    }
}



function checkUAString() {
	var ua = navigator.userAgent;

	UA_MOB = ua.indexOf("Mobile") != -1;
	UA_AND = ua.indexOf("Android") != -1;
	UA_IOS = ua.indexOf("iPhone") != -1;
}



function handleOrientation(event) {
	GYRO_EXISTS = (event.alpha != null || event.beta != null || event.gamma != null);
    if (DEBUG_MODE) {
        document.querySelector('.gyro').innerHTML = "HAS_GYRO\t" + HAS_GYRO
            + "\nalpha:\t" + event.alpha
            + "\nbeta:\t"  + event.beta
            + "\ngamma:\t" + event.gamma + "\n";
    }
}






function setTimeLimit() {
    if (MODE_GYRO) {
        if (UA_IOS) {
            TIME_LIMIT += TIME_GYRO_IOS
        } else if (UA_AND) {
            TIME_LIMIT += TIME_GYRO_AND;
        }
    } else {
        if (MODE_BATTERY) {
            TIME_LIMIT += TIME_BATTERY;
        }
    }

    // Detect device when timer limit is reached
    var timeoutID = window.setTimeout(detectDevice, TIME_LIMIT);
}


//////////


function decide() {

    if (DEBUG_MODE) {
        document.querySelector('.long-guess').innerHTML = ""
            + "\nGYRO_EXISTS\t\t" + GYRO_EXISTS
            + "\nBATT_ACCESS\t\t" + BATT_ACCESS
            + "\nBATT_FULL\t" + BATT_FULL
            + "\nBATT_CHARGING\t\t" + BATT_CHARGING
            + "\n" + navigator.language;
        document.querySelector('.sizes').innerHTML += ""
            + "\nscreen.width\t\t" + screen.width
            + "\nscreen.height\t\t" + screen.height
            + "\nwindow.innerWidth\t" + window.innerWidth
            + "\nwindow.innerHeight\t" + window.innerHeight
            + "\n\n" + navigator.userAgent;
    }

	if (!UA_MOB) {
		IS_MOBILE = false;

	} else if (UA_IOS) {
		IS_MOBILE = !BATT_ACCESS;

	} else if (!BATT_ACCESS || BATT_FULL || BATT_CHARGING) {
		IS_MOBILE = false;

	} else if (UA_AND) {
		IS_MOBILE = GYRO_EXISTS;

	} else {
        IS_MOBILE = false;
    }

    return;
}


function detectDevice() {
    if (!DECIDED) {
        DECIDED = true;
        decide();
        result();
    }
}



function result() {
    console.log(0 + IS_MOBILE);
    document.querySelector('.sizes').innerHTML = IS_MOBILE;
    if (DEBUG_MODE) {
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





