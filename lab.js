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


window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
	var absolute = event.absolute;
	var alpha    = event.alpha;
	var beta     = event.beta;
	var gamma    = event.gamma;

  // Do stuff with the new orientation data
	console.log("Orientation data:"
		+ "\nalpha: " + alpha
		+ "\nbeta: " + beta
		+ "\ngamma: " + gamma
	);
  //document.write("abg: " + alpha + " " + beta + " " + gamma );

  // if (alpha == null && beta == null && gamma == null) {
  // 	console.log("This is not clean input.");
  // } else {
  // 	document.write("Welcome!");
  // }
}

document.addEventListener("click", function( event ) {
    // display the current click count inside the clicked div
    console.log("click:"
    	+ "\nx: " + event.screenX 
    	+ "\ny: " + event.screenY
    );
}, false);



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
