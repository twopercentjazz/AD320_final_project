/*
 * This file contains the JavaScript for the filter buttons on the rooms and booking page.
 */
"use strict";

(function() {
    window.addEventListener("load", init);

    function init() {
        let currFilter = "none";
        id("filter-btn1").addEventListener("click", () => {
            id("filter-message-text").textContent = "Filter rooms using the buttons above";
            if (currFilter === "filters") {
                toggleFilters();
            } else if (currFilter === "views") {
                toggleViews();
            }
            toggleSearch();
            currFilter = "search";
        });
        id("filter-btn2").addEventListener("click", () => {
            id("filter-message-text").textContent = "Filter rooms using the buttons above";
            toggleSearch();
            currFilter = "none";
        });
        id("filter-btn3").addEventListener("click", () => {
            id("filter-message-text").textContent = "Filter rooms using the buttons above";
            if (currFilter === "search") {
                toggleSearch();
            } else if (currFilter === "views") {
                toggleViews();
            }
            toggleFilters();
            currFilter = "filters";
        });
        id("filter-btn4").addEventListener("click", () => {
            id("filter-message-text").textContent = "Filter rooms using the buttons above";
            toggleFilters();
            currFilter = "none";
        });
        id("filter-btn5").addEventListener("click", () => {
            id("filter-message-text").textContent = "Filter rooms using the buttons above";
            if (currFilter === "filters") {
                toggleFilters();
            } else if (currFilter === "search") {
                toggleSearch();
            }
            toggleViews();
            currFilter = "views";
        });
        id("filter-btn6").addEventListener("click", () => {
            id("filter-message-text").textContent = "Filter rooms using the buttons above";
            toggleViews();
            currFilter = "none";
        });
    }

    function toggleSearch() {
        id("show-search").classList.toggle("hidden");
        id("hide-search").classList.toggle("hidden");
        id("search-section").classList.toggle("hidden");
    }

    function toggleFilters() {
        id("show-filters").classList.toggle("hidden");
        id("hide-filters").classList.toggle("hidden");
        id("filters-section").classList.toggle("hidden");
    }

    function toggleViews() {
        id("show-views").classList.toggle("hidden");
        id("hide-views").classList.toggle("hidden");
        id("views-section").classList.toggle("hidden");
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