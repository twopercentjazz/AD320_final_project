/*
 *
 */
"use strict";

const apiUrl = 'http://localhost:8000/';
const account = 'src/html/account.html';

(function() {
    window.addEventListener("load", init);
 
    function init() {
        checkLoggedIn();
        id("link1").addEventListener('click', e => {
            e.preventDefault();
            id('popup').style.display = 'block';
        });
        id('popup').addEventListener('click', e => {
            if(e.target === id('popup')) {
                id('popup').style.display ='none';
        }
        });
        id('register').addEventListener('submit', e => {
            e.preventDefault();
            registerUser();
        });
        id('register-btn').addEventListener('click', () => checkValidInput());

        id('login').addEventListener('submit', e => {
            e.preventDefault();
            login();
        });
        
    }
    
    //Appends all input from the registration form
    function registerUser() {
        let params = new FormData();
        let name = id('first-name').value + " " + id('last-name').value;
        params.append('name', name);
        params.append('username', id('user').value)
        params.append('email', id('email').value);
        params.append('password', id('pw').value);
        params.append('state', id("state").value);
        params.append('city', id("city").value);
        params.append('code', id("code").value);
        params.append('address', id("address").value);
        params.append('phone', id("phone-num").value);
        // for (let e of params.entries()) {
        //     console.log(e);
        // }
        createUserRequest(params);
    }

    //regex and error message for the specified input 
    function checkValidInput() {
        errorMsg(id('first-name'), !/^[A-Za-z]+$/.test(id('first-name').value), "Invalid name, must be letters");
        errorMsg(id('last-name'), !/^[A-Za-z]+$/.test(id('last-name').value), "Invalid name, must be letters");
        errorMsg(id('verify-email'), id('email').value !== id('verify-email').value, "Emails do not match");
        errorMsg(id('verify-pw'), id('pw').value !== id('verify-pw').value, "Passwords do not match")
        errorMsg(id('phone-num'), id('phone-num').value.length !== 10, "Must be 10 numbers");
        errorMsg(id('state'), !/^[A-Za-z]+$/.test(id('state').value), "Invalid state, must be 2 letters");
        errorMsg(id('code'), id('code').value.length !== 5, "Must be 5 numbers");
       
    }

    /*checks if the given input in the registration form, is valid if not display error message 
    * on given input
    */
    function errorMsg(input, condition, msg) {
        let validityState = input.validity;

        if (validityState.valueMissing) {
            input.setCustomValidity('Required field');
        } else if (condition) {
            input.setCustomValidity(msg);
        } else {
            input.setCustomValidity("");
        }
        input.reportValidity();
    }
    
    //retrieves the inputs from the login popup 
    function login() {
        let params = new FormData();
        params.append('username', id('username').value);
        params.append('password', id('user-pw').value)
        loginRequest(params)
    }

    /* sends post request with all valid inputs, will add user to database if it does not exist
    *  otherwise displays an error
    */
    function createUserRequest(params) {
        fetch(apiUrl + 'create-user-full', {method: 'POST', body: params})
        .then(statusCheck)
        .then(res => res.text())
        .then(console.log)
        .catch(registerError);
    } 

    //sends post req with input, will log the user in and redirect them to the accounts page
    function loginRequest(params) {
        fetch(apiUrl + 'login', {method: 'POST', body: params})
        .then(statusCheck)
        .then(res => res.text())
        .then(console.log)
        .then(() => {
            window.location.href = apiUrl + account;
        })
        .catch(loginError);
    }

    //if the user did not log out and their session has not expired, redirect to account page
    function checkLoggedIn() { 
        fetch(apiUrl + 'activity-check', {method: 'GET'})
        .then(statusCheck)
        .then(res => res.text())
        .then(res => {
            if(res === "true") {
                window.location.href = apiUrl + account;
            } else {
                console.log("No Active Session");
            }
        })
        .catch(console.error);
    }

    /**
     * error message displayed if user data exists containing the current 
     * 
     */
    function registerError(e) {
        id('register-error').textContent = "e"
    }

     /**
     * error message displayed if username or password doesn't exist or is incorrect 
     * 
     */
    function loginError(e) {
        id('login-error').textContent = e;
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