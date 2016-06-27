console.log("Hello world!");

console.log("Screen data:");
console.log("width: " + screen.width);
console.log("height: " + screen.height);
//alert(screen.width + " x " + screen.height);


window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
  var absolute = event.absolute;
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;

  // Do stuff with the new orientation data
  console.log("alpha: " + alpha
  	+ "\nbeta: " + beta
  	+ "\ngamma: " + gamma
  );
  document.write("abg:" + alpha + " " + beta + " " + gamma );
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
