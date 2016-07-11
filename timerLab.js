/*
 * File: timerLab.js
 * Author: Zachary Liou
 * Date Created: 2016 July 11
 */


console.time("timer");
console.time("to-ori");

var TIME_LIMIT = 200;
var flag = false;
var timeoutID = window.setTimeout(stopTimer, TIME_LIMIT);

window.addEventListener("deviceorientation", handleOrientation, true);

console.log("Starting timer ...");


function stopTimer() {
    console.timeEnd("timer");
    console.log("Timer stopped.");
    if (flag) {
        console.log("The flag has been set.");
    } else {
        console.log("The flag has NOT been set.");
    }
}

function handleOrientation(event) {
    console.timeEnd("to-ori");
    var absolute = event.absolute;
    var alpha    = event.alpha;
    var beta     = event.beta;
    var gamma    = event.gamma;

    // Check that gyro returns values
    if (alpha != null && beta != null && gamma != null) {
        console.log("There is a gyro!");
    }

    flag = true;
} // end handleOrientation

