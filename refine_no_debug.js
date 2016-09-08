/* File: refine.js
 * Date created: 2016 August 24
 * Description: lenient/simple version of detect.js
 */



var start = Date.now();


var IS_MOBILE       = false;

var TIME_LIMIT 		= 10;
var TIME_BATTERY    = 75;
var TIME_GYRO_AND   = 300;
var TIME_GYRO_IOS   = 500;
var DECIDED 		= false;

var HAS_BATTERY 	= false;
var HAS_FULL_BATTERY = false;
var IS_CHARGING     = false;

var HAS_GYRO 		= false;

var UA_MOB          = false;
var UA_AND          = false;
var UA_IOS 			= false;

var MODE_BATTERY    = false;
var MODE_GYRO       = false;



checkUAString();
setModes(CONFIG);       // CONFIG should be set by dz.php

setTimeLimit();
var timeoutID = window.setTimeout(detectDevice, TIME_LIMIT);

if (MODE_GYRO) {
    window.addEventListener("deviceorientation", handleOrientation, true);
}

if (MODE_BATTERY) {
    navigator.getBattery().then(checkBattery);
}



function checkBattery(battery) {
    var end = Date.now();
    HAS_BATTERY = true;
    IS_CHARGING = battery.charging;
    HAS_FULL_BATTERY = battery.level == 1;
}



function checkUAString() {
	var ua = navigator.userAgent;

	UA_MOB = ua.indexOf("Mobile") != -1;
	UA_AND = ua.indexOf("Android") != -1;
	UA_IOS = ua.indexOf("iPhone") != -1;
}



function handleOrientation(event) {
	HAS_GYRO = (event.alpha != null || event.beta != null || event.gamma != null);
}



function setModes(config) {
    var MASK_BATTERY = 2;
    var MASK_GYRO = 1;

    MODE_BATTERY = config & MASK_BATTERY;
    MODE_GYRO = config & MASK_GYRO;
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
}


//////////


function decide() {

	if (!UA_MOB) {
		IS_MOBILE = false;
	} else if (UA_IOS) {
		IS_MOBILE = !HAS_BATTERY;
	} else if (!HAS_BATTERY || HAS_FULL_BATTERY || IS_CHARGING) {
		IS_MOBILE = false;
	} else if (UA_AND) {
		IS_MOBILE = HAS_GYRO;
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
}





