/*
 *
 */
"use strict";

(function() {
    window.addEventListener("load", init);

    function init() {
        // void testNewUser();
        // void testLogin();
        // void testActive();
        // void testLogout();
        void testRoomCall();
        // void testTime();
    }

    async function testActive(){
        // let params = new FormData;
        fetch("/activity-check")
            .then(statusCheck)
            .then(response => response.text())
            .then(console.log)
            .catch(console.log);
    }

    async function testTime() {
        fetch("/time")
            .then(statusCheck)
            .then(resp => resp.text())
            .then(console.log)
            .catch(console.log);
    }

    async function testNewUser(){
        let params = new FormData;
        // let testName = "kyle";
        // let fakeName = "notKyle";
        // let testName = "calliope";
        // let fakeName = "karen";
        let testName = "kiwawa";
        let fakeName = "keeki";
        params.append("username", testName);
        params.append("password", "badPassword");
        params.append("name", fakeName);
        params.append("email", "fakeEmail");

        fetch("/create-user", {method :"POST", body: params})
            .then(statusCheck)
            .then(response => response.text())
            .then(console.log)
            .catch(console.log);
    }

    async function testLogin(){
        let params = new FormData;
        // let testName = "kyle";
        let testName = "calliope";
        params.append("username", testName);
        params.append("password", "badPassword");

        fetch("/login", {method :"POST", body: params})
            .then(statusCheck)
            .then(response => response.text())
            .then(console.log)
            .catch(console.log);
    }

    async function testLogout(){
        let params = new FormData;
        fetch("/logout", {method :"POST", body: params})
            .then(statusCheck)
            .then(response => response.text())
            .then(console.log)
            .catch(console.log);
    }

    async function testDB() {
        fetch('http://localhost:8000/test')
            .then(statusCheck)
            .then(resp => resp.text())
            .then(processTest)
            .catch(console.log);
    }

    async function testRoomCall() {
        fetch('/rooms')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(processJson)
            .catch(console.log);
    }

    function processJson(response){
        for (let i = 0; i < response.length;i++){
            console.log(response[i]);
        }
        // response.forEach(console.log);
    }

    function processTest(responseText) {
        let text = document.createElement("p");
        text.textContent = responseText;
        //text.style.color = "red";
        document.body.appendChild(text);
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
