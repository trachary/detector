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

var HAS_SCREEN      = false;

var UA_MOB          = false;
var UA_AND          = false;
var UA_IOS 			= false;

var MODE_BATTERY    = true;
var MODE_GYRO       = true;

var DEBUG_MODE      = true;



checkUAString();

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
    document.querySelector('.sizes').innerHTML += "\n\n" + (end - start) + "ms to battery\n";
}



function checkScreenData() {
    if (UA_IOS) {

    }
}



function checkUAString() {
	var ua = navigator.userAgent;

	UA_MOB = ua.indexOf("Mobile") != -1;
	UA_AND = ua.indexOf("Android") != -1;
	UA_IOS = ua.indexOf("iPhone") != -1;

    document.querySelector('.sizes').innerHTML = ua;
}



function handleOrientation(event) {
	HAS_GYRO = (event.alpha != null || event.beta != null || event.gamma != null);
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

    // TIME_LIMIT += (MODE_GYRO * UA_IOS * TIME_GYRO_IOS) 
    //     + (MODE_GYRO * UA_AND * TIME_GYRO_AND)
    //     + (MODE_BATTERY * TIME_BATTERY); 
}


//////////


function checkFlags() {

    if (DEBUG_MODE) {
        document.querySelector('.long-guess').innerHTML = ""
            + "\nHAS_GYRO\t\t" + HAS_GYRO
            + "\nHAS_BATTERY\t\t" + HAS_BATTERY
            + "\nHAS_FULL_BATTERY\t" + HAS_FULL_BATTERY
            + "\nIS_CHARGING\t\t" + IS_CHARGING
            + "\n" + navigator.language;
        document.querySelector('.sizes').innerHTML += ""
            + "\nscreen.width\t\t" + screen.width
            + "\nscreen.height\t\t" + screen.height
            + "\nwindow.innerWidth\t" + window.innerWidth
            + "\nwindow.innerHeight\t" + window.innerHeight
            + "\n";
    }

	if (!UA_MOB) {
		IS_MOBILE = false;
		return;
	}

	if (UA_IOS) {
		IS_MOBILE = !HAS_BATTERY;
		return;
	}

	if (!HAS_BATTERY || HAS_FULL_BATTERY || IS_CHARGING) {
		IS_MOBILE = false;
		return;
	}

	if (UA_AND) {
		IS_MOBILE = HAS_GYRO;
		return;
	}

	IS_MOBILE = false;
}


function detectDevice() {
    if (!DECIDED) {
        DECIDED = true;
        checkFlags();
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





