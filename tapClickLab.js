/*
 * File: tabClickLab.js
 * Author: Zachary Liou
 * Date Created: 2016 July 11
 * Purpose: Determine whether taps and clicks are registered differently.
 * Conclusion: Clicks and taps are registered differently.
 */


document.write("Hello world!");


var body = document.getElementById("lorem");

body.onclick = showAlert;
body.addEventListener("touchstart", handleStart, false);

function showAlert() {
    alert("clicked");
}

function handleStart() {
    alert("touched");
}
