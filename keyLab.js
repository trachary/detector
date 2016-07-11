/*
 * File: tabClickLab.js
 * Author: Zachary Liou
 * Date Created: 2016 July 11
 * Purpose: Determine whether taps and keys are registered differently.
 * Conclusion: TBD
 */


var body = document.getElementById("lorem");

document.write("Hello world!");
document.addEventListener('keydown', handleKey, false);
body.addEventListener("touchstart", handleStart, false);

function handleKey() {
    document.write("Key pressed. ");
}

function handleStart() {
    document.write("Touched. ");
}
