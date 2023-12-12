/*
 *
 */
"use strict";

(function() {
    window.addEventListener("load", init);

    function init() {
        setAvailabilityFilters();
        id("nullLink").addEventListener("click",  (e) => {
            e.preventDefault();
        });
        checkActivity();
    }

    function setAvailabilityFilters() {
        if (window.sessionStorage.getItem("checkin") === null) {
            setDefaultDates();
            setDefaultPeople();
            window.sessionStorage.setItem("checkin", id("checkin-date").value);
            window.sessionStorage.setItem("checkout", id("checkout-date").value);
            window.sessionStorage.setItem("people", id("people").value);
        } else {
            id("checkin-date").value = window.sessionStorage.getItem("checkin");
            id("checkout-date").value = window.sessionStorage.getItem("checkout");
            id("people").value = window.sessionStorage.getItem("people");
        }
    }

    function setDefaultDates() {
        let checkin = new Date();
        let checkout = new Date(checkin);
        checkout.setDate(checkout.getDate() + 1);
        let year = checkin.getFullYear();
        let month = checkin.getMonth() + 1;
        let day = checkin.getDate();
        id("checkin-date").value = year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
        year = checkout.getFullYear();
        month = checkout.getMonth() + 1;
        day = checkout.getDate();
        id("checkout-date").value = year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
    }

    function setDefaultPeople() {
        id("people").value = 2;
    }

    function checkActivity() {
        fetch("/activity-check")
            .then(statusCheck)
            .then(response => response.text())
            .then(processCheckActivity)
            .catch(console.log);
    }

    function processCheckActivity(res) {
        if (res === "true") {
            toggleNav();
        }
    }
    function toggleNav() {
        id("login").classList.toggle("hidden");
        id("account").classList.toggle("hidden");
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