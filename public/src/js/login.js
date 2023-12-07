/*
 *
 */
 "use strict";

 (function() {
     window.addEventListener("load", init);
 
     function init() {
        id("login-btn").addEventListener('click', () => {
            id('popup').style.display = 'block';
        });
        id('popup').addEventListener('click', (e) => {
            if(e.target === id('popup')) {
                id('popup').style.display ='none';
        }
        });
        id('register').addEventListener('submit', e => {
            e.preventDefault();
            registerUser();
        })
        id('login').addEventListener('submit', e => {
            e.preventDefault();
            login();
        })

     }
 
     function registerUser() {
        let params = new FormData();
        params.append('fname', id('first-name').value);
        params.append('lname', id('last-name').value);
        params.append('email', id('email').value);
        params.append('password', id('pw').value);

        makeRequest(params, "register");
     }

     function login() {
        let params = new FormData();
        params.append('email', id('user-email').value);
        params.append('password', id('user-pw').value)
        makeRequest(params, "login")
    }

     function makeRequest(params, endpoint) {
        fetch('http://localhost:8000/' + endpoint, {method: 'POST', body: params})
        .then(statusCheck)
        .then(res => res.text())
        .then(console.log)
        .catch(console.error);
     }

    //  function process(data) {
    //     console.log(data);
    //  }

 
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