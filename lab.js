

console.log("Hello world!");

// Init vars for document
var sizes = document.querySelector('.sizes');
var power = document.querySelector('.power');
var percent = document.querySelector('.percent');
var gyro = document.querySelector('.gyro');
var wheel = document.querySelector('.wheel');
var quickGuess = document.querySelector('.quick-guess');
var longGuess = document.querySelector('.long-guess');

// Init vars for detection
var clicked = false;
var scrolled = false;
var rotated = false;
var hasGyro = false;

// Init other gyro vars
var initAlpha = null;
var initBeta = null;
var initGamma = null;

// Add event listeners
window.addEventListener("deviceorientation", handleOrientation, true);
document.addEventListener("click", handleClick, false);
document.addEventListener("wheel", handleWheel);


//////////


// Get screen data
sizes.innerHTML = "screen width: " + screen.width
	+ "\nscreen height: " + screen.height
	+ "\nwindow width: " + window.innerWidth
	+ "\nwindow height: " + window.innerHeight;

// Set data display defaults
wheel.innerHTML = "No wheel detected yet.";
longGuess.innerHTML = "...";

// Quick-detect
quickGuess.innerHTML = "" + detectDevice();


//////////


/**
 * Note: This function assumes that all mobile browsers have gyro/accelerometer access
 */
function handleOrientation(event) {
	var absolute = event.absolute;
	var alpha    = event.alpha;
	var beta     = event.beta;
	var gamma    = event.gamma;

	gyro.innerHTML = "alpha: " + alpha
		+ "\nbeta: " + beta
		+ "\ngamma: " + gamma;

	// Check that gyro returns values
	if (alpha != null && beta != null && gamma != null) {
 	 	hasGyro = true;

 	 	// Set init gyro params if not already set
 	 	if (initAlpha == null && initBeta == null && initGamma == null) {
 	 		initAlpha = alpha;
 	 		initBeta = beta;
 	 		initGamma = gamma;
            alert("Setting initial values");
 	 	} else if (alpha != initAlpha && beta != initBeta && gamma != initGamma) {
 	 	    rotated = true;
            longDetect();
 	 	} // end else 
	} // end outer if
} // end handleOrientation


function handleClick(event) {
    console.log("click:"
    	+ "\nx: " + event.screenX 
    	+ "\ny: " + event.screenY
    );

    if (event.altKey || event.ctrlKey || event.metaKey) {
    	computer();
    }

    if (event.which == 2) {
    	handleWheel();
    }
}


function handleWheel(event) {
	scrolled = true;
	wheel.innerHTML = "Wheel movement detected.";
    longDetect();
}


/**
 * @return	1 if the device is likely a "dirty" device,
 * 			2 if the device is likely a "clean" device, or
 *			0 if the device type cannot be confidently determined
 */
function checkHandles() {
	if (scrolled) 	return 1;
	if (rotated || hasGyro)	return 2;

	return 0;
}


function detectDevice() {
	console.log("Detecting device ...");

	var guess = "";

	var handles = checkHandles();
	if (handles == 1) {
		guess = "This is NOT a clean mobile device." 
			+ "\nConfidence: high"
			+ "\nReasons: scroll wheel detected";
	} else if (handles == 2) {
		guess = "This is a clean mobile device."
            + "\nConfidence: moderate"
            + "\nReasons: functioning gyroscope.";
	} else {
        guess = "This is NOT a clean mobile device."
            + "\nConfidence: moderate"
            + "\nReasons: no functioning gyroscope.";
    }

	if (screen.height < window.innerHeight) {}

	return guess;
}


function longDetect() {
    longGuess.innerHTML = detectDevice();
}


navigator.getBattery().then(function(battery) {
  
  	percent.innerHTML = battery.level + "%";

  	if (battery.charging) power.innerHTML = "Device is plugged in.";
  	else power.innerHTML = "Device is NOT plugged in.";
  
  	// ... and any subsequent updates.
  	battery.onlevelchange = function() {
    	percent.innerHTML = this.level + "%";
  	};

  	battery.onchargingchange = function() {
  		if (battery.charging) {
  			power.innerHTML = "Device is plugged in."
  		} else  {
  			power.innerHTML = "Device is NOT plugged in."
  		}
  	}

});
