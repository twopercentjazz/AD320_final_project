/*
 *
 */
"use strict";
const apiUrl = "http://localhost:8000/";
const loginUrl = 'src/html/login.html';
(function() {
    window.addEventListener("load", init);

    function init() {
        checkLoggedIn();
        hide();
        hideReservations();
        getUserInfo();
        toggleDisplay('profile');
        // retrieveReservations();
        id("settings-btn").addEventListener("click", () => toggleDisplay("settings"));
        id("profile-btn").addEventListener("click", () => toggleDisplay("profile"));
        id("reservations-btn").addEventListener("click", () => toggleDisplay("reservations"));
        id('current-btn').addEventListener('click', () => {
            filter("upcoming");
            retrieveReservations('future-reservations');
        });
        id('previous-btn').addEventListener('click', () => {
            filter("previous")
            retrieveReservations('past-reservations');
        });
        id('sign-out-btn').addEventListener('click', logout);
    }   

    function checkLoggedIn() {
        fetch(apiUrl + 'activity-check', {method: 'GET'})
        .then(statusCheck)
        .then(res => res.text())
        .then(res => {
            if(res === "false") {
                window.location.href = apiUrl + loginUrl;
            } else {
                console.log('Successfully logged in')
            }
        })
        .catch(console.error);
    }

    function hide() {
        let allDisplays = qsa('.profile-display');
        allDisplays.forEach(display => {
            display.style.display = 'none';
        });
    }

    function hideReservations() {
        let allDisplays = qsa('.reservation-display');
        allDisplays.forEach(display => {
            display.style.display = 'none';
        }); 
    }

    function toggleDisplay(option) {
        hide();
        id(option).style.display = 'block';
    }
    
    function filter(option) {
        hideReservations();
        id(option).style.display = 'block';
    }

    function getUserInfo() {
       fetch(apiUrl + 'user-all-info', {method: 'GET'})
       .then(statusCheck)
       .then(res => res.json())
       .then(updateProfile)
       .catch(console.error);
    }

    function updateProfile(data) {
        let name = data.name;
        let [first, last] = name.split(" ");
        id('user').textContent = data.user;
        id('first-name').textContent = first;
        id('last-name').textContent = last;
        similarUpdates(qsa('.name'), data.name);
        similarUpdates(qsa('.email'), data.email);
        similarUpdates(qsa('.phone'), data.phone);
        // let address = data.address + ' <br> ' + data.city + ', ' + data.state + ', ' + data.code;
        id('address').innerHTML = data.address + ' <br> ' + data.city + ', ' + data.state + ', ' + data.code;;
    }

    function similarUpdates(element, data) {
        element.forEach(e => {
            e.textContent = data;
        })
    }

    function retrieveReservations(endpoint){
        fetch(apiUrl + endpoint)
        .then(statusCheck)
        .then(res => res.json())
        .then(res => {
            console.log(res);
        })
        .catch(console.error);
        
    }

    function logout() {
        fetch(apiUrl + 'logout', {method: 'POST'})
        .then(statusCheck)
        .then(res => res.text())
        .then(res => {
            console.log(res);
            window.location.href = apiUrl + loginUrl;
        })

        .catch(console.error);
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