/*
 *
 */
"use strict";

const apiUrl = 'http://localhost:8000/';
// const baseUrl = 'http://127.0.0.1:8000/';
const account = 'src/html/account.html';

(function() {
    window.addEventListener("load", init);
 
    function init() {
        // id('phone-num').setCustomValidity("Can only be numbers");
        checkLoggedIn();
        id("login-btn").addEventListener('click', () => {
            id('popup').style.display = 'block';
        });
        id('popup').addEventListener('click', (e) => {
            if(e.target === id('popup')) {
                id('popup').style.display ='none';
        }
        });
        // qsa('input').addEventListener('change', () => clearErrors());
        id('register').addEventListener('submit', e => {
            e.preventDefault();
            registerUser();
        });
        // id('register-btn').addEventListener('click', () => checkValidInput());

        id('login').addEventListener('submit', e => {
            e.preventDefault();
            login();
        });
        id('testlogout').addEventListener('click', () => logout());
    }
 
    function registerUser() {
        let params = new FormData();
        let name = id('first-name').value + " " + id('last-name').value;
        params.append('name', name);
        params.append('username', id('user').value)
        params.append('email', id('email').value);
        params.append('password', id('pw').value);
        // params.append('state', id("state").value);
        // params.append('city', id("city").value);
        // params.append('postalcode', id("code").value);
        // params.append('street', id("address").value);
        // params.append('number', id("phone-num").value);

        createUserRequest(params);
    }

    function checkValidInput() {
        errorMsg(id('first-name'), !/^[A-Za-z]+$/.test(id('first-name').value), "Invalid name, must be letters");
        errorMsg(id('last-name'), !/^[A-Za-z]+$/.test(id('last-name').value), "Invalid name, must be letters");
        errorMsg(id('verify-email'), id('email').value !== id('verify-email').value, "Emails do not match");
        errorMsg(id('verify-pw'), id('pw').value !== id('verify-pw').value, "Passwords do not match")
        errorMsg(id('phone-num'), id('phone-num').value.length !== 10, "Must be 10 numbers");
        errorMsg(id('state'), !/^[A-Za-z]+$/.test(id('state').value), "Invalid state, must be letters");
        errorMsg(id('code'), id('code').value.length < 5, "Must be 5-12 numbers");
       
    }

    function clearErrors() {
        let formInputs = qsa('input');
        formInputs.forEach(input => {
            id(input).setCustomValidity("");
        });
    }

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
    
    function login() {
        let params = new FormData();
        params.append('username', id('username').value);
        params.append('password', id('user-pw').value)
        loginRequest(params)
    }

    function logout() {
        fetch(apiUrl + 'logout')
        .then(statusCheck)
        .then(res => res.text())
        .then(console.log)
        .catch(console.error);
    }

    function createUserRequest(params) {
        fetch(apiUrl + 'create-user', {method: 'POST', body: params})
        .then(statusCheck)
        .then(res => res.text())
        .then(console.log)
        .catch(console.error);
    } 

    function loginRequest(params) {
        console.log('cookies: ', document.cookie);
        fetch(apiUrl + 'login', {method: 'POST', body: params})
        .then(statusCheck)
        .then(res => res.text())
        .then(console.log)
        .then(() => {
            window.location.href = apiUrl + account;
        })
        .catch(console.error);
    }

    function checkLoggedIn() { 
        fetch(apiUrl + 'activity-check', {method: 'GET'})
        .then(statusCheck)
        .then(res => res.text())
        .then(res => {
            console.log(res);
            if(res === "Active session in progress.") {
                window.location.href = apiUrl + account;
            }
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