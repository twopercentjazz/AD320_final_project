/* Derrek
 * account.js
 * All scripts regarding the account page. User driven, all functions and features will only
 * work from user interaction. Additioally a user must be logged in to reach these features.
 * Fetch requests are made when the user checks information they included on account creation.
 * During account creation, there are checks to determine if the input is valid or not, and will
 * only send that information to the server once successful 
 * Another fetch request is made to retrieve all(if any) reservations the user has made
 * and displays it in a recept like format
 * If a user is currently not logged in, they will be redirected to the login/registation page
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
        toggleDisplay("profile");
        id("profile-btn").addEventListener("click", () => toggleDisplay("profile"));
        id("reservations-btn").addEventListener("click", () => toggleDisplay("reservations"));
        id('current-btn').addEventListener('click', () => {
            filter("upcoming");
            retrieveReservations('future-reservations');
        });
        id('previous-btn').addEventListener('click', () => {
            filter("previous")
            // retrieveReservations('past-reservations');
            displayError("No reservations found");
        });
        id('sign-out-btn').addEventListener('click', logout);
    }   

    /**
     * if the account page is opened, check if a user is logged in via cookies/session
     * if there are none (they logged out or session expired, or never logged in)
     * redirect to login page
     */
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

    //hides all displays
    function hide() {
        let allDisplays = qsa('.profile-display');
        allDisplays.forEach(display => {
            display.style.display = 'none';
        });
    }

    //hides all displays of the reservtions (past and future)
    function hideReservations() {
        let allDisplays = qsa('.reservation-display');
        allDisplays.forEach(display => {
            display.style.display = 'none';
        }); 
    }

    //toggle display based on the profile option chosen
    function toggleDisplay(option) {
        hide();
        id(option).style.display = 'block';
    }
    
    //toggle display for which reservations are shown
    function filter(option) {
        hideReservations();
        id(option).style.display = 'block';
    }

    //sends get request to retriev all information of user currently logged in
    function getUserInfo() {
       fetch(apiUrl + 'user-all-info', {method: 'GET'})
       .then(statusCheck)
       .then(res => res.json())
       .then(updateProfile)
       .catch(console.error);
    }

    /**
     * updates the profile based on the information the server sent back
     * @param {data} json data of the user
     */
    function updateProfile(data) {
        let name = data.name;
        let [first, last] = name.split(" ");
        id('user').textContent = data.user;
        id('first-name').textContent = first;
        id('last-name').textContent = last;
        similarUpdates(qsa('.name'), data.name);
        similarUpdates(qsa('.email'), data.email);
        similarUpdates(qsa('.phone'), data.phone);
        id('address').innerHTML = data.address + ' <br> ' + data.city + ', ' + data.state + ', ' + data.code;;
    }

    /**
     * extension of the updateProfile function, focused on updating tags that will show the same data
     * @param {} element the class of the given tags 
     * @param {*} data the information to update with
     */
    function similarUpdates(element, data) {
        element.forEach(e => {
            e.textContent = data;
        })
    }

    /**
     * retrieves reservations the user has made
     * @param {} endpoint either future or past resrvations 
     */
    function retrieveReservations(endpoint){
        fetch(apiUrl + endpoint)
        .then(statusCheck)
        .then(res => res.json())
        .then(res => {
            if(res.length === 0) {
                displayError("No reservations found", endpoint);
            } else {
                displayReservations(res, endpoint);
            }
            
        })
        .catch(displayError);
    }

    /**
     * Even wehn tables are empty (no reservations found), server sends back a empty json [],
     * this is to prevent appending empty json data. Additonally since previous reservations arent being saved
     * this is to prevent website from crashing, when the search query fails.
     * @param {*} e error msg returned from server
     * @param {*} endpoint determines which display will appear
     */
    function displayError(e, endpoint){
        let reservationDisplay = "";
        if (endpoint === "future-reservations") {
            reservationDisplay = document.getElementById("upcoming");    
        } else {
            reservationDisplay = document.getElementById("previous");
        
        }

        reservationDisplay.innerHTML = "";
        let msg = gen("p");
        msg.textContent = e;
        appendElement(reservationDisplay, msg);
    }

    /**
     * helper function updates the text content of the element passed
     * @param {*} element  
     * @param {*} string 
     * @param {*} data 
     */
    function updateTxtCon(element, string, data){
        element.textContent = string + data;
    }

    /**
     * helper function, appends the newly created elements together
     * @param {*} element1 
     * @param {*} element2 
     */
    function appendElement(element1, element2) {
        element1.appendChild(element2);
    }

    /**
     * loops through the json data, and creates info cards of the given reservation
     * orginally had a different format thus the naming conventions, but due to the length
     * of the data input, it changes the format of the display
     * @param {*} data 
     */
    function displayReservations(data, endpoint) {
        let reservationDisplay = "";
        let filter = gen("h1");
        if (endpoint === "future-reservations") {
            reservationDisplay = document.getElementById("upcoming"); 
            filter.textContent = "Upcoming Reservations";   
        } else {
            reservationDisplay = document.getElementById("previous");
            filter.textContent = "Previous Reservations";
        }
        reservationDisplay.innerHTML = "";
      
        // if (endpoint === "future-reservations") {
        //     filter.textContent = "Upcoming Reservations";
        // } else {
        //     filter.textContent = "Previous Reservations";
        // }
        appendElement(reservationDisplay, filter);

        data.forEach(reservation => {
            let reservationCard = gen("div");
            reservationCard.classList.add("reservation-card");
    
            let top = gen("div");
            top.classList.add("top");
    
            let topMid = gen("div");
            let topLeft = gen("div");
            let topRight = gen("div");
    
            let id = gen("p");
            updateTxtCon(id, "ID: ", reservation.id);
    
            let cost = gen("p");
            updateTxtCon(cost, "Cost: ", reservation.cost);
    
            let reservedDate = gen("p");
            updateTxtCon(reservedDate, "Reserved: ", reservation.reserved);
    
            let confirm = gen("p");
            updateTxtCon(confirm, "Confirmation: ", reservation.confirm);
    
            appendElement(topLeft, id);
            appendElement(topLeft, cost);
    
            appendElement(topRight, reservedDate);
            appendElement(topRight, confirm);
    
            appendElement(topMid, topLeft);
            appendElement(topMid, topRight);
    
            appendElement(top, topMid);
    
            let bot = gen("div");
            bot.classList.add("bottom");
    
            let botMid = gen("div");
            let botLeft = gen("div");
            let botRight = gen("div");
    
            let checkIn = gen("p");
            updateTxtCon(checkIn, "Check In: ", reservation.ckin);
    
            let checkOut = gen("p");
            updateTxtCon(checkOut, "Check Out: ", reservation.ckout);
    
            let occupants = gen("p");
            updateTxtCon(occupants, "Occupants: ", reservation.occupants);
    
            let room = gen("p");
            updateTxtCon(room, "Room: ", reservation.room);
    
            let reservedBy = gen("p");
            updateTxtCon(reservedBy, "Reserved by: ", reservation.user);
    
            appendElement(botLeft, checkIn);
            appendElement(botLeft, checkOut);
    
            appendElement(botRight, occupants);
            appendElement(botRight, room);
            appendElement(botRight, reservedBy);
    
            appendElement(botMid, botLeft);
            appendElement(botMid, botRight);
    
            appendElement(bot, botMid);
    
            appendElement(reservationCard, top);
            appendElement(reservationCard, bot);
    
            appendElement(reservationDisplay, reservationCard);
        });
    }

    
    //logs the user out and redirects to the login/registration page
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