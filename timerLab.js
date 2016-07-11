/*
 * File: timerLab.js
 * Author: Zachary Liou
 * Date Created: 2016 July 11
 */


/*
 * Prepare document
 */

/*
 * Time functionality
 */
console.time("timer");

// Bind HTML elements
var ua = document.querySelector('.ua');
var oscpu = document.querySelector('.oscpu');
var sizes = document.querySelector('.sizes');
var power = document.querySelector('.power');
var percent = document.querySelector('.percent');
var gyro = document.querySelector('.gyro');
var wheel = document.querySelector('.wheel');
var quickGuess = document.querySelector('.quick-guess');
var longGuess = document.querySelector('.long-guess');

// Init vars for detection
var keyword = false;
var clicked = false;
var scrolled = false;
var rotated = false;
var hasGyro = false;

// Init other gyro vars
var initAlpha = null;
var initBeta = null;
var initGamma = null;

// Add event listeners
window.addEventListener("deviceorientation", handleOrientation, true);
document.addEventListener("click", handleClick, false);
document.addEventListener("wheel", handleWheel);









console.timeEnd("timer");


/*
 * Functions below
 */

