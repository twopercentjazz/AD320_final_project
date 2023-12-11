/*
 *
 */
"use strict";

(function() {
    const loggedIn = true;
    window.addEventListener("load", init);

    function init() {
        toggleNav(loggedIn);




        const CHECKIN = new Date();
        const CHECKOUT = new Date(CHECKIN);
        CHECKOUT.setDate(CHECKOUT.getDate() + 1);
        let year = CHECKIN.getFullYear();
        let month = CHECKIN.getMonth() + 1;
        let day = CHECKIN.getDate();
        id("checkin-date").value = year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
        year = CHECKOUT.getFullYear();
        month = CHECKOUT.getMonth() + 1;
        day = CHECKOUT.getDate();
        id("checkout-date").value = year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");









        id("check").addEventListener("click", checkAvailability);

        /*
        qsa("a").forEach(link => link.addEventListener("click",  (e) => {
            e.preventDefault();
        }));

         */
        id("link1").addEventListener("click",  (e) => {
            e.preventDefault();
            id("login").classList.toggle("hidden");
            id("account").classList.toggle("hidden");
        });
        id("link2").addEventListener("click",  (e) => {
            e.preventDefault();
            id("login").classList.toggle("hidden");
            id("account").classList.toggle("hidden");
        });
        id("nullLink").addEventListener("click",  (e) => {
            e.preventDefault();
        });


        //void testDB();
    }

    function toggleNav(loggedIn) {
        id("login").classList.toggle("hidden");
        id("account").classList.toggle("hidden");
    }



    function checkAvailability() {
        id("error-msg-box").innerHTML = "";
        let error = gen("p");
        let checkin = id("checkin-date").value;
        let checkout = id("checkout-date").value;
        let people = id("people").value;
        if (!isValidDate(checkin) || !isValidDate(checkout) || !isValidCheckin(checkin, checkout)) {
            error.textContent = "Please enter valid dates.";
            id("error-msg-box").appendChild(error);
        } else {
            window.sessionStorage.setItem("checkin", checkin);
            window.sessionStorage.setItem("checkout", checkout);
            window.sessionStorage.setItem("people", people);
            window.location.href = "src/html/booking.html";
        }
    }
    function isValidCheckin(checkin, checkout) {
        let checkinDate = new Date(checkin);
        let checkoutDate = new Date(checkout);
        if (checkinDate >= checkoutDate) {
            return false;
        }
        return true;
    }

    function isValidDate(date) {
        let inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);
        if (isNaN(inputDate)) {
            return false;
        }
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let nextYear = new Date(today);
        nextYear.setFullYear(today.getFullYear() + 1);
        today.setDate(today.getDate() - 1);
        nextYear.setDate(nextYear.getDate() - 1);
        let year = inputDate.getFullYear();
        let month = inputDate.getMonth() + 1;
        let day = inputDate.getDate();
        if (inputDate < today || inputDate > nextYear) {
            return false;
        }
        /*
        if (month < 1 || month > 12) {
            return false;
        }
        if (day < 1 || day > validateDay(month, year)) {
            return false;
        }
         */
        return true;
    }


    function validateDay(month, year) {
        /*
        let day = 31;
        if (month === 4 || month === 6 || month === 9 || month === 11) {
            day = 30;
        } else if (month === 2) {
            if (year % 4 === 0) {
                day = 29;
            } else {
                day = 28;
            }
        }
        return day;

         */
        return new Date(year, month, 0).getDate();
    }


    /*
    async function testDB() {
        fetch('http://localhost:8000/test')
            .then(statusCheck)
            .then(resp => resp.text())
            .then(processTest)
            .catch(console.log);
    }

    function processTest(responseText) {
        let text = document.createElement("p");
        text.textContent = responseText;
        //text.style.color = "red";
        document.body.appendChild(text);
    }
    */


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