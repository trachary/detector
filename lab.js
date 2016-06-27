console.log("Hello world!");

navigator.getBattery().then(function(battery) {
  console.log(battery.level);
  document.write(battery.level);
  // ... and any subsequent updates.
  battery.onlevelchange = function() {
    console.log(this.level);
    document.write(this.level);
  };
});