/*
 * File: mouseLab.js
 * Author: Zachary Liou
 * Date created: 2016 Aug 5
 * Notes:   "mouseover" and "mouseenter" work only after the mouse moves;
 *          detecting a mouse can equivalently done by detecting any mouse
 *          movement.
 */

(function() {
    "use strict";

    var body = document.body;

    body.addEventListener("mouseover", handleMouseEnter);

    function handleMouseEnter() {
        alert("lol");
    }

})();
