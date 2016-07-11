/*
 * File: tabClickLab.js
 * Author: Zachary Liou
 * Date Created: 2016 July 11
 * Purpose: Determine whether taps and keys are registered differently.
 * Conclusion: TBD
 */


var body = document.getElementById("lorem");
var numTaps = 0;

document.write("Hello world!");
document.addEventListener('keydown', handleKey, false);
body.addEventListener("touchstart", handleTouch, false);
body.onclick = handleTouch;

function handleKey() {
    document.write("<div style='height:900px;width:900px;background:red'/>");
}

function handleTouch() {
    if (numTaps > 0) { 
        document.write("<div style='height:900px;width:900px;background:blue'/>");
    }
    ++numTaps;
}
