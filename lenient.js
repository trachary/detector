/* File: lenient.js
 * Date created: 2016 August 15
 * Description: lenient/simple version of detect.js
 */


var IS_MOBILE = false;



/*
 * Init vars
 */

// Detection vars 
var TIME_LIMIT 		= 500;
var TIME_LIMIT_IOS  = 800;
var DECIDED 		= false;
var DEBUG_MODE 		= true;

// Confidence vars and constants
var CONFIDENCE  	= 100;			// Subtractive system
var CONFIDENCE_THRESHOLD = 60;

var BATTERY_CONF    = 20;   // Does the device have a battery?
var CHARGING_CONF   = -140; // Is the device plugged in?
var GYRO_CONF       = 70;   // Does the device have a gyro?
var PORTRAIT_CONF   = 40;   // Is the screen longer than it is wide?
var ROTATE_CONF     = 70;   // Did the gyro's xyz values change?
var SCREEN_CONF     = -10;  // Is the screen's aspect ratio NOT (16:9 or 3:2)?
var TOUCH_CONF      = 10;   // Was there a touch event?

// Other constants
var RATIOS = [
    (16.0 / 9.0),       // 16:9
    (568.0 / 320.0),    // iPhone 5
    (375.0 / 667.0),    // iPhone 6
    (3.0 / 2.0),        // iPhone 4
    (414.0 / 736.0),    // iPhone 6 Plus
];  
var VALID_LANGS = [
    "en-us",
    "en",
];

// Detection flags
var HAS_BATTERY 	= false;
var HAS_COMMON_ASPECT_RATIO = false;
var HAS_FULL_BATTERY = false;
var HAS_GYRO 		= false;
var HAS_PORTRAIT	= false;
var HAS_VALID_LANG	= false;
var IS_ANDROID 		= false;
var IS_CHARGING		= false;
var IS_IOS 			= false;
var UA_MIN			= false;	// Whether UA contains prereq keywords



/*
 * Begin detection procedure
 */


// Check UA String first
checkUAString();
// if (!UA_MIN) {
// 	return;
// }

// Set timeout for detection
var timeLimit = IS_IOS ? TIME_LIMIT_IOS : TIME_LIMIT;
var timeoutID = window.setTimeout(detectDevice, timeLimit);

// Add event listeners
window.addEventListener("deviceorientation", handleOrientation, true);

// Check remaining properties
navigator.getBattery().then(checkBattery);
checkLanguage();
checkScreenData();



/*
 * Functions below
 */

function checkBattery(battery) {
    HAS_BATTERY = true;
   
    // Detect if initially charging
    if (battery.charging) {
        IS_CHARGING = true;
    }
    if (battery.level == 1) {
        HAS_FULL_BATTERY = true;
    } 
}



function checkLanguage() {
    for (var i = 0; i < VALID_LANGS.length; ++i) {
        if (VALID_LANGS[i].toLowerCase() == navigator.language.toLowerCase()) {
            HAS_VALID_LANG = true;
            return;
        }
    }
}



function checkScreenData() {
    if (!screen.width || !screen.height) {
        HAS_COMMON_ASPECT_RATIO = true;
        HAS_PORTRAIT = false;

        // if (DEBUG) sizes.innerHTML = "no screen data available.";

        return;
    }

    // Calculate screen ratio
    var ratio = screen.width / screen.height;

    // Set flags
    for (var i = 0; i < RATIOS.length; ++i) {
        if (ratio == RATIOS[i] || ratio == (1 / RATIOS[i])) {
            HAS_COMMON_ASPECT_RATIO = true;
            break;
        }
    }
    HAS_PORTRAIT = ratio < 1;
}



function checkUAString() {
	var ua = navigator.userAgent;

	// All mobile devices have "Mobile" in their UAs
	if (ua.indexOf("Mobile") == -1) {
		UA_MIN = false;
		detectDevice();
	} else {
		UA_MIN = true;
	}

	// All Android devices have "Android" in their UAs; all iOS devices have "iPhone"
	IS_ANDROID = ua.indexOf("Android") != -1;
	IS_IOS = ua.indexOf("iPhone") != -1;

}



function handleOrientation(event) {
	HAS_GYRO = (event.alpha != null || event.beta != null || event.gamma != null);
	if (DEBUG_MODE) {
		document.querySelector('.gyro').innerHTML = ""
			+ "\nalpha: " + event.alpha
			+ "\nbeta: "  + event.beta
			+ "\ngamma: " + event.gamma + "\n";
	}
}


//////////


function checkFlags() {

	// Protect against double-checking
	if (!UA_MIN) {
		IS_MOBILE = false;
		return;
	}



	if (IS_IOS) {
		IS_MOBILE = (!HAS_BATTERY && HAS_FULL_BATTERY && IS_CHARGING);
		return;
	}

	if (!HAS_VALID_LANG || !HAS_BATTERY || HAS_FULL_BATTERY || IS_CHARGING) {
		IS_MOBILE = false;
		return;
	}

	if (HAS_GYRO) {
		IS_MOBILE = true;
		return;
	}

	if (IS_ANDROID) {
		IS_MOBILE = HAS_GYRO;
		return;
	}

	IS_MOBILE = false;
}


function detectDevice() {
    if (!DECIDED) {
        DECIDED = true;
        checkFlags();
        // if (DEBUG_MODE) debug();
        decide();
    }
}



function decide() {

    if (!IS_MOBILE) {
    	console.log("a");
    } else {
    	console.log("0");
    }

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





