/*
 *
 */
"use strict";

(function() {
    window.addEventListener("load", init);

    function init() {
        hide();
        id("settings-btn").addEventListener("click", () => toggleDisplay("settings"));
        id("payment-btn").addEventListener("click", () => toggleDisplay("payment"));
        // id("overview-btn").addEventListener("click", () => toggleDisplay("overview"));
        id("profile-btn").addEventListener("click", () => toggleDisplay("profile"));
        id("reservations-btn").addEventListener("click", () => toggleDisplay("reservations"));
        // id("sign-out-btn").addEventListener("click", () => toggleDisplay("home"));
    }   


    function hide() {
        let allDisplays = qsa('.profile-display');
        allDisplays.forEach(display => {
            display.style.display = 'none';
        });
    }

    function toggleDisplay(option) {
        hide();
        id(option).style.display = 'block';
    }
    
    /**
     * Returns the response's result text if successful, otherwise
     * returns the rejected Promise result with an error status and corresponding text
     * @param {object} res - response to check for success/error
     * @return {object} - valid response if response was successful, otherwise rejected
     *                    Promise result
     */
    async function statusCheck(res) {
        if (!res.ok) {
            throw new Error(await res.text());
        }
        return res;
    }

    /**
     * Returns the element that has the ID attribute with the specified value.
     * @param {string} idName - element ID
     * @returns {object} DOM object associated with id.
     */
    function id(idName) {
        return document.getElementById(idName);
    }

    /**
     * Returns the first element that matches the given CSS selector.
     * @param {string} selector - CSS query selector.
     * @returns {object} The first DOM object matching the query.
     */
    function qs(selector) {
        return document.querySelector(selector);
    }

    /**
     * Returns the array of elements that match the given CSS selector.
     * @param {string} selector - CSS query selector
     * @returns {object[]} array of DOM objects matching the query.
     */
    function qsa(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Returns a new element with the given tag name.
     * @param {string} tagName - HTML tag name for new DOM element.
     * @returns {object} New DOM object for given HTML tag.
     */
    function gen(tagName) {
        return document.createElement(tagName);
    }
})();