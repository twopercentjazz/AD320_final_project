/*
 *
 */
"use strict";

(function() {
    window.addEventListener("load", init);

    function init() {
        // void testNewUser();
        // void testFullUser();
        // void testLogin();
        // void testActive();
        // void testLogout();
        // void testRooms();
        // void testRoomNumber();
        // void testReserve();
        // void testInfo();
        // void testAllInfo();
        // void testReservations();
        // void testPastReservations();
        // void testFutureReservations();
        // void testAvailable();

        void testFilter();
        // void testFilter2();
        // void testDateFilter();

        // void testUpdateInfo();
        // void testFilter();
    }

    async function testNewUser(){
        let params = new FormData;
        let testName = "calliope";
        let fakeName = "karen";
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

    async function testFullUser(){
        let params = new FormData;
        params.append("username", "Irys");
        params.append("password", "badPassword");
        params.append("name", "Baelz");
        params.append("email", "fakeEmail");
        params.append("phone", "555-duck-you");
        params.append("address", "Tokyo");
        params.append("city", "Tokyo");
        params.append("state", "Fu");
        params.append("code", "78232");

        fetch("/create-user-full", {method :"POST", body: params})
            .then(statusCheck)
            .then(response => response.text())
            .then(console.log)
            .catch(console.log);
    }

    async function testLogin(){
        let params = new FormData;
        // let testName = "kyle";
        let testName = "Irys";
        params.append("username", testName);
        params.append("password", "badPassword");

        fetch("/login", {method :"POST", body: params})
            .then(statusCheck)
            .then(response => response.text())
            .then(console.log)
            .catch(console.log);
    }

    async function testActive(){
        // let params = new FormData;
        fetch("/activity-check")
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

    async function testRooms() {
        fetch('/rooms')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(processJson)
            .catch(console.log);
    }

    async function testRoomNumber(){
        fetch('/room-info/217')
            .then(statusCheck)
            .then(resp => resp.text())
            .then(console.log)
            .catch(console.log);
    }

    async function testReserve(){
        let params = new FormData;
        params.append("room", 220);
        params.append("checkIn", "2024-03-13");
        params.append("checkOut", "2024-03-15");
        params.append("occupants", 2);

        fetch("/reserve", {method :"POST", body: params})
            .then(statusCheck)
            .then(response => response.text())
            .then(console.log)
            .catch(console.log);
    }

    async function testInfo(){
        fetch('/user-info')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(console.log)
            .catch(console.log);
    }

    async function testAllInfo(){
        fetch('/user-all-info')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(console.log)
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

    async function testReservations() {
        fetch('/user-reservations')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(processJson)
            .catch(console.log);
    }

    async function testPastReservations() {
        fetch('/past-reservations')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(processJson)
            .catch(console.log);
    }

    async function testFutureReservations() {
        fetch('/future-reservations')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(processJson)
            .catch(console.log);
    }

    async function testAvailable(){
        fetch('/available-rooms?guests=2&checkin=2024-02-12&checkout=2024-03-01')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(console.log)
            .catch(console.log);
    }

    async function testFilter() {
        // fetch('/room-filter?guests=2&roomType=Suite&bedType=King')
        fetch('/room-filter?guests=3&bedType=Queen')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(processJson)
            .catch(console.log);
    }

    async function testFilter2() {
        fetch('/room-filter/3/null/Queen/null/null')
        // fetch('/room-filter/2')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(processJson)
            .catch(console.log);
    }

    //TODO: Untested or fails past this point.
    async function testDateFilter() {
        fetch('/room-filter?occupants=2&roomType=Suite&bedType=King&checkIn=2024-02-14&checkOut=2024-04-10')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(processJson)
            .catch(console.log);
    }

    async function test() {
        fetch('/available-rooms')
            .then(statusCheck)
            .then(resp => resp.json())
            .then(processJson)
            .catch(console.log);
    }

    async function testUpdateInfo(){
        let params = new FormData;
        params.append("phone", 666);
        params.append("city", "Tokyo");
        params.append("state", "Hell");
        params.append("code", "78232");

        fetch("/update-user-info", {method :"POST", body: params})
            .then(statusCheck)
            .then(response => response.text())
            .then(console.log)
            .catch(console.log);
    }

})();
