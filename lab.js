console.log("Hello world!");

navigator.getBattery().then(function(battery) {
  console.log(battery.level);
  document.write(battery.level);
  document.write("<br/>");
  
  // ... and any subsequent updates.
  battery.onlevelchange = function() {
    console.log(this.level);
    document.write(this.level);
  };

  battery.onchargingchange = function() {
  	if (this.charging) {
  		console.log("plugged in");
  		document.write("plugged in<br/>");
  	} else  {
  		console.log("unplugged");
  		document.write("unplugged<br/>");
  	}
  }

});
