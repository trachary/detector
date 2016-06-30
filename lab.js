console.log("Hello world!");

console.log("Screen data:"
	+ "\nscreen width: " + screen.width
	+ "\nscreen height: " + screen.height
	+ "\nwindow width: " + window.innerWidth
	+ "\nwindow height: " + window.innerHeight);

document.write("screen width: " + screen.width
	+ "<br/>screen height: " + screen.height
	+ "<br/>window width: " + window.innerWidth
	+ "<br/>window height: " + window.innerHeight);

//alert(screen.width + " x " + screen.height);


//////////


var clicked = false;
var scrolled = false;

var rotated = false;
var hasGyro = false;
var initAlpha = null;
var initBeta = null;
var initGamma = null;



window.addEventListener("deviceorientation", handleOrientation, true);
document.addEventListener("click", handleClick, false);
document.addEventListener("wheel", handleWheel);

detectDevice();


//////////


/**
 * Note: This function assumes that all mobile browsers have gyro/accelerometer access
 */
function handleOrientation(event) {
	var absolute = event.absolute;
	var alpha    = event.alpha;
	var beta     = event.beta;
	var gamma    = event.gamma;

	document.write("Orientation data:"
		+ "\nalpha: " + alpha
		+ "\nbeta: " + beta
		+ "\ngamma: " + gamma
	);

	// Check that gyro returns values
	if (alpha != null && beta != null && gamma != null) {
 	 	hasGyro = true;

 	 	// Set init gyro params if not already set
 	 	if (initAlpha == null && initBeta == null && initGamma == null) {
 	 		initAlpha = alpha;
 	 		initBeta = beta;
 	 		initGamma = gamma;
 	 	} else {
 	 		if (alpha != initAlpha && beta != initBeta && gamma != initGamma) {
 	 			rotated = true;
 	 		}
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
	console.log("Jesus took the wheel.");
	computer();
}

function computer() {
	console.log("This is a computer");
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
	document.write("<br/>");

	var handles = checkHandles();
	if (handles == 1) {
		document.write("This is not a mobile device.");
	} else if (handles == 2) {
		document.write("This is a mobile device");
	}


	if (screen.height < window.innerHeight) {

	}

}




// navigator.getBattery().then(function(battery) {
//   console.log(battery.level);
//   document.write(battery.level);
//   document.write("<br/>");
  
//   // ... and any subsequent updates.
//   battery.onlevelchange = function() {
//     console.log(this.level);
//     document.write(this.level);
//   };

//   battery.onchargingchange = function() {
//   	if (this.charging) {
//   		console.log("plugged in");
//   		document.write("plugged in<br/>");
//   	} else  {
//   		console.log("unplugged");
//   		document.write("unplugged<br/>");
//   	}
//   }

// });
