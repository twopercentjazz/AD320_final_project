/*
 *
 */
"use strict";

(function() {
    window.addEventListener("load", init);

    function init() {
        displayRooms().then(rooms => {
            displayList(rooms);
        });
        displayRooms().then(rooms => {
            displayTile(rooms);
        });
        id("status-room").style.backgroundColor = "darkgrey";
        id("check").addEventListener("click", checkAvailability);
        id("cancel-btn").addEventListener("click",  cancelReview);


        id("confirm-btn").addEventListener("click", () => {
            displayUserData().then(user => {
                confirmReview(user);
            });
        });
        id("login-btn").addEventListener("click", function(event) {
            event.preventDefault();
            userLogin();
        });
        id("cancel-btn2").addEventListener("click",  cancelSubmit);
        id("back-btn").addEventListener("click", backToReview);
        id("submit-btn").addEventListener("click", submitReservation);
        id("finished-btn").addEventListener("click", finishBooking);
        id("account-btn").addEventListener("click", goToAccount);
        qsa("#view-form input").forEach(view => view.addEventListener("change", changeView));
        id("display-list").addEventListener("click", event => {
            displayRooms().then(rooms => {
                showListDetails(event, rooms);
            });
        });
        id("display-tile").addEventListener("click", event => {
            displayRooms().then(rooms => {
                showTileDetails(event, rooms);
            });
        });

        id("clear-btn1").addEventListener("click", clearSearch);
        id("clear-btn2").addEventListener("click", clearSearch);
        id("filter-btn").addEventListener('click', function(event) {
            event.preventDefault();
            filterResults();
            if (!noneChecked()) {
                let filters = getCheckedFilters();
                fetch("http://localhost:8000/room-filter/" + getQueryString(filters))
                    .then(statusCheck3)
                    .then(response => response.json())
                    .then(response => {
                        console.log(JSON.stringify(response));
                        displayList(response);
                        displayTile(response);
                    })
            }
        });
        id("search-btn").addEventListener('click', function(event) {
            event.preventDefault();
            filterResults();
            if (!isSearchBarEmpty()) {
                let filters = getSearchFilters(id("search-bar").value.toLowerCase());
                fetch("http://localhost:8000/room-filter/" + getQueryString(filters))
                    .then(statusCheck3)
                    .then(response => response.json())
                    .then(response => {
                        console.log(JSON.stringify(response));
                        displayList(response);
                        displayTile(response);
                    })
            }
        });
    }

    async function getRoomList() {
        let params = "guests=" + window.sessionStorage.getItem("people") + "&checkin=" +
            window.sessionStorage.getItem("checkin") + "&checkout=" +
            window.sessionStorage.getItem("checkout");
        return fetch("http://localhost:8000/available-rooms?" + params)
            .then(statusCheck3)
            .then(response => response.json())
            .catch(console.log);
    }

    async function displayRooms() {
        return await getRoomList();
    }

    function submitReservation(event) {
        event.preventDefault();
        isLoggedIn().then(loggedIn => {
            if (loggedIn) {
                let form = id("transaction-form");
                let formData = new FormData(form); // Gather the form data
                let object = {};
                formData.forEach((value, key) => object[key] = value);
                let json = JSON.stringify(object);
                fetch('http://localhost:8000/reserve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: json
                })
                    .then(statusCheck)
                    .then(response => response.text())
                    .then(data => {
                        // get confirmation number from server, using test var now
                        //id("confirm-num").value = data;
                        id("confirm-text").textContent = data;
                        id("confirm-number").textContent = data;
                        // show success page
                        id("status-submit").style.backgroundColor = "#737373";
                        id("status-done").style.backgroundColor = "darkgrey";
                        id("submit").classList.toggle("hidden");
                        id("room-booked").classList.toggle("hidden");
                        id("book-room").classList.toggle("hidden");
                        id("confirm-msg").textContent = "Booking Receipt";

                        id("confirmation").classList.toggle("hidden");
                        id("success").classList.toggle("hidden");
                        id("submit-page-buttons").classList.toggle("hidden");
                        id("complete-page-buttons").classList.toggle("hidden");
                        id("submit-text-msg").textContent =
                            "All work and no play makes for a dull stay. Come play with us!";
                        window.scrollTo(0, 0);
                    })
                    .catch(console.log);
            } else {
                id("submit-text-msg").textContent = "Please log in to complete your reservation";
            }
        });
    }

    function getQueryString(filters) {
        return Object.entries(filters).filter(([key, value]) => value !== undefined)
            .map(([key, value]) => `${value}`).join('/');
    }

    function getSearchFilters(inputString) {
        let bedCountRegex = /(1|2)/g;
        let roomTypeRegex = /(economy|standard|deluxe|suite)/g;
        let bedTypeRegex = /(twin|full|queen|king)/g;
        let bedCount = inputString.match(bedCountRegex);
        let guests = window.sessionStorage.getItem("people");
        let roomType = inputString.match(roomTypeRegex);
        let bedType = inputString.match(bedTypeRegex);
        let checkin = window.sessionStorage.getItem("checkin");
        let checkout = window.sessionStorage.getItem("checkout");
        return {
            bedCount: bedCount ? bedCount[0] : undefined,
            guests: guests,
            roomType: roomType ? capitalizeFirstLetter(roomType[0]) : undefined,
            bedType: bedType ? capitalizeFirstLetter(bedType[0]) : undefined,
            checkin: checkin,
            checkout: checkout
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    function getCheckedFilters() {
        let bedCount = Array.from(qsa('input[name="count"]:checked')).map(e => e.value);
        let guests = window.sessionStorage.getItem("people");
        let roomType = Array.from(qsa('input[name="type"]:checked')).map(e => e.value);
        let bedType = Array.from(qsa('input[name="bed"]:checked')).map(e => e.value);
        let checkin = window.sessionStorage.getItem("checkin");
        let checkout = window.sessionStorage.getItem("checkout");

        return  {
            bedCount: bedCount,
            guests: guests,
            roomType: roomType,
            bedType: bedType,
            checkin: checkin,
            checkout: checkout
        };
    }

    function noneChecked() {
        let checkboxes = qsa('#filter-form input[type="radio"]');
        for (let checkbox of checkboxes) {
            if (checkbox.checked) {
                return false;
            }
        }
        return true;
    }

    function isSearchBarEmpty() {
        let searchBar = id("search-bar").value;
        if (searchBar === "") {
            return true;
        }
        return false;
    }

    function filterResults() {
        if (noneChecked()) {
            id("filter-message-text").textContent = "Please select at least one filter.";
        } else {
            id("filter-message-text").textContent = "Filter rooms using the buttons above";
        }
    }

    function clearSearch() {
        id("filter-message-text").textContent = "Filter rooms using the buttons above";
        id("search-bar").value = "";
        let inputs = document.querySelectorAll('#filter-form input.default');
        inputs.forEach(input => {
            input.checked = true;
        });
        displayRooms().then(rooms => {
            displayList(rooms);
        });
        displayRooms().then(rooms => {
            displayTile(rooms);
        });
    }

    function finishBooking() {
        resetBookingPage();
        window.location.href = "../../index.html";
    }

    function goToAccount() {
        resetBookingPage();
        window.location.href = "account.html";
    }

    function resetBookingPage() {
        id("status-room").style.backgroundColor = "darkgrey";
        id("status-done").style.backgroundColor = "#737373";

        id("submit-page-buttons").classList.toggle("hidden");
        id("complete-page-buttons").classList.toggle("hidden");

        id("success").classList.toggle("hidden");

        id("confirmation").classList.toggle("hidden");

        id("room-booked").classList.toggle("hidden");
        id("book-room").classList.toggle("hidden");

        id("submit").classList.toggle("hidden");

        id("confirm-room").classList.toggle("hidden");
        id("choose-room").classList.toggle("hidden");
        id("bottom").classList.toggle("hidden");
        id("make-reservation").classList.toggle("hidden");
        id("trans-form").classList.toggle("hidden");

        id("people").value = 2;

        id("submit-msg").classList.toggle("hidden");

        window.sessionStorage.clear();
    }

    function login() {
        toggleNav();
        id("login-box").classList.toggle("hidden");
        id("confirm-msg").textContent = "Booking Summary";
        id("make-reservation").classList.toggle("hidden");
        id("bottom").classList.toggle("hidden");
        id("trans-form").classList.toggle("hidden");
        id("submit-text-msg").textContent = "Please click the submit button to complete your reservation";
    }

    function userLogin(){
        let params = {
            'username': id('username').value,
            'password': id('password').value
        };
        fetch("http://localhost:8000/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        })
            .then(statusCheck2)
            .then(res => res.text())
            .then(processLogin)
            .catch(console.error);
    }

    function processLogin(res) {
        console.log('Response text:', res);

        if (res === "Successfully logged in.") {
            login();
        }
    }

    function toggleNav() {
        id("login").classList.toggle("hidden");
        id("account").classList.toggle("hidden");
    }

    function backToReview() {
        id("status-submit").style.backgroundColor = "#737373";
        id("status-review").style.backgroundColor = "darkgrey";
        id("confirm-room").classList.toggle("hidden");
        id("review-room").classList.toggle("hidden");
        id("make-reservation").classList.toggle("hidden");
        id("trans-form").classList.toggle("hidden");
        window.scrollTo(0, 0);
    }

    function confirmReview(user) {
        id("status-review").style.backgroundColor = "#737373";
        id("status-submit").style.backgroundColor = "darkgrey";
        id("review-room").classList.toggle("hidden");
        id("confirm-room").classList.toggle("hidden");

        //set transaction form
        //id("curr-date").value = getTodayDate();
        id("date-text").textContent = formatDate(getTodayDate());
        id("room-num-text").textContent = window.sessionStorage.getItem("room");
        id("room").value = window.sessionStorage.getItem("room");
        id("config-text").textContent = window.sessionStorage.getItem("config");
        id("ckin-text").textContent = formatDate(window.sessionStorage.getItem("checkin"));
        id("ckin").value = window.sessionStorage.getItem("checkin");
        id("ckout-text").textContent = formatDate(window.sessionStorage.getItem("checkout"));
        id("ckout").value = window.sessionStorage.getItem("checkout");
        id("occupants-text").textContent = getPeopleText();
        id("occupants").value = window.sessionStorage.getItem("people");
        id("length-text").textContent = getNights();
        id("rate-text").textContent = "$" + window.sessionStorage.getItem("rate") + "/night";
        id("cost-text").textContent = "$" + window.sessionStorage.getItem("cost");
        //id("cost").value = window.sessionStorage.getItem("cost");
        id("name-text").textContent = user.name;
        id("email-text").textContent = user.email;
        id("user-text").textContent = user.user;
        //id("user").value = user.user;
        id("submit-msg").classList.add("hidden");
        id("submit-msg").classList.toggle("hidden");
        window.scrollTo(0, 0);
        isLoggedIn().then(loggedIn => {
            if (loggedIn) {
                id("confirm-msg").textContent = "Booking Summary";
                id("trans-form").classList.toggle("hidden");
                id("make-reservation").classList.toggle("hidden");
                id("submit-text-msg").textContent = "Please click the submit button to complete your reservation";
            } else {
                id("confirm-msg").textContent = "Please log in to complete your reservation";
                id("login-box").classList.toggle("hidden");
                id("bottom").classList.toggle("hidden");
                id("submit-text-msg").textContent = "Must be Logged in to continue";
            }
        });
    }

    async function getUserData() {
        return fetch("http://localhost:8000/user-all-info", {method: 'GET'})
            .then(statusCheck)
            .then(response => response.json())
            .catch(console.log);
    }

    async function displayUserData() {
        return await getUserData();
    }

    async function checkActivity() {
        return fetch("http://localhost:8000/activity-check")
            .then(statusCheck)
            .then(response => response.text())
            .then(processCheckActivity)
            .catch(console.log);
    }

    async function processCheckActivity(res) {
        return res === "true";
    }

    async function isLoggedIn() {
        let loggedIn = await checkActivity();
        return loggedIn;
    }

    function getTodayDate() {
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        return year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
    }

    function cancelSubmit() {
        id("status-room").style.backgroundColor = "darkgrey";
        id("status-submit").style.backgroundColor = "#737373";
        id("confirm-room").classList.toggle("hidden");
        id("choose-room").classList.toggle("hidden");
        id("bottom").classList.toggle("hidden");
        id("make-reservation").classList.toggle("hidden");
        id("trans-form").classList.toggle("hidden");
        window.scrollTo(0, 0);
    }

    function cancelReview() {
        id("status-room").style.backgroundColor = "darkgrey";
        id("status-review").style.backgroundColor = "#737373";
        id("choose-room").classList.toggle("hidden");
        id("review-room").classList.toggle("hidden");
        id("bottom").classList.toggle("hidden");
        window.scrollTo(0, 0);
    }

    function formatDate(dateString) {
        let date = new Date(dateString);
        // Get the time zone offset in milliseconds
        let timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
        date = new Date(date.getTime() + timezoneOffset);
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
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
            displayRooms().then(rooms => {
                displayList(rooms);
            });
            displayRooms().then(rooms => {
                displayTile(rooms);
            });
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
        return true;
    }

    function chooseRoom(room, testRooms) {
        window.sessionStorage.setItem("room", room);
        id("room-detail-view").classList.toggle("hidden");
        id("status-room").style.backgroundColor = "#737373";
        id("status-review").style.backgroundColor = "darkgrey";
        id("choose-room").classList.toggle("hidden");
        id("review-room").classList.toggle("hidden");
        id("in").textContent = formatDate(window.sessionStorage.getItem("checkin"));
        id("out").textContent = formatDate(window.sessionStorage.getItem("checkout"));
        id("num-nights").textContent = getNights();
        id("num-people").textContent = getPeopleText();
        let roomIndex = getIndex(room, testRooms);
        let total = testRooms[roomIndex].rate * window.sessionStorage.getItem("nights");
        window.sessionStorage.setItem("rate", testRooms[roomIndex].rate);
        window.sessionStorage.setItem("cost", total.toFixed(2).toString());
        id("dollars").textContent = "$" + total.toFixed(2);
        setRoomConfig(testRooms[roomIndex]);
        createReviewRoomDetail(testRooms[roomIndex]);
        id("bottom").classList.toggle("hidden");
        window.scrollTo(0, 0);
    }

    function setRoomConfig(room) {
        let configString = room.count + " " + room.bed + " " + room.type;
        window.sessionStorage.setItem("config", configString);
    }

    function getNights() {
        let nights = "";
        let checkin = new Date(window.sessionStorage.getItem("checkin"));
        let checkout = new Date(window.sessionStorage.getItem("checkout"));
        let diff = checkout.getTime() - checkin.getTime();
        nights += Math.ceil(diff / (1000 * 3600 * 24));
        window.sessionStorage.setItem("nights", nights);
        if (nights === "1") {
            return nights + " Night";
        } else {
            return nights + " Nights";
        }
    }

    function getPeopleText() {
        let people = window.sessionStorage.getItem("people");
        if (people === "1") {
            return "1 person";
        } else {
            return people + " people";
        }
    }

    function showListDetails(event, testRooms) {
        let room = event.target.closest(".room-item-list");
        if (room !== null) {
            createRoomDetail(testRooms[getIndex(room.value, testRooms)], testRooms);
            id("room-detail-view").classList.toggle("hidden");
        }
    }

    function showTileDetails(event, testRooms) {
        let room = event.target.closest(".room-item-tile");
        if (room !== null) {
            createRoomDetail(testRooms[getIndex(room.value, testRooms)], testRooms);
            id("room-detail-view").classList.toggle("hidden");
        }
    }

    function getIndex(roomNum, testRooms) {
        for (let i = 0; i < testRooms.length; i++) {
            if (testRooms[i].number === roomNum) {
                return i;
            }
        }
        return -1;
    }

    function createReviewRoomDetail(room) {
        let roomDetail = id("review-details");
        roomDetail.innerHTML = "";

        let roomImg = gen("img");
        roomImg.src = room.picture;
        roomImg.alt = room.type + " room";
        roomDetail.appendChild(roomImg);

        let roomInfo = gen("div");
        roomInfo.classList.add("room-info");
        roomDetail.appendChild(roomInfo);

        let roomNum = gen("h3");
        roomNum.textContent = "Room Number: " + room.number;
        roomInfo.appendChild(roomNum);

        let roomType = gen("p");
        roomType.textContent = "Room Type........................................ " + room.type;
        roomInfo.appendChild(roomType);

        let roomBed = gen("p");
        roomBed.textContent = "Bed Type.............................................. " + room.bed + " bed";
        roomInfo.appendChild(roomBed);

        let roomBedCount = gen("p");
        roomBedCount.textContent = "Bed Count.......................................... " + room.count + " bed";
        roomInfo.appendChild(roomBedCount);

        let roomMax = gen("p");
        roomMax.textContent = "Max Occupancy..................... " + room.max + " people";
        roomInfo.appendChild(roomMax);

        let roomRate = gen("p");
        roomRate.textContent = "Room Rate.......................................... $" + room.rate + "/night";
        roomInfo.appendChild(roomRate);
    }

    function createRoomDetail(room, testRooms) {
        let roomDetail = id("room-detail");
        roomDetail.innerHTML = "";

        let roomImg = gen("img");
        roomImg.classList.add("room-pic");
        roomImg.src = room.picture;
        roomImg.alt = room.type + " room";
        roomDetail.appendChild(roomImg);

        let roomInfo = gen("div");
        roomInfo.classList.add("room-info");
        roomDetail.appendChild(roomInfo);

        let roomNum = gen("h3");
        roomNum.textContent = "Room Number: " + room.number;
        roomInfo.appendChild(roomNum);

        let roomType = gen("p");
        roomType.textContent = "Room Type: " + room.type;
        roomInfo.appendChild(roomType);

        let roomBed = gen("p");
        roomBed.textContent = "Bed Type: " + room.bed + " bed";
        roomInfo.appendChild(roomBed);

        let roomBedCount = gen("p");
        roomBedCount.textContent = "Bed Count: " + room.count + " bed";
        roomInfo.appendChild(roomBedCount);

        let roomMax = gen("p");
        roomMax.textContent = "Max Occupancy: " + room.max + " people";
        roomInfo.appendChild(roomMax);

        let roomRate = gen("p");
        roomRate.textContent = "Room Rate: $" + room.rate + "/night";
        roomInfo.appendChild(roomRate);

        let bookBtn = gen("button");
        bookBtn.classList.add("book-btn");
        bookBtn.addEventListener("click", () => chooseRoom(room.number, testRooms));
        bookBtn.type = "button";
        bookBtn.textContent = "Book Now";
        bookBtn.style.color = "#d7be8a";
        roomInfo.appendChild(bookBtn);

        let closeBtn = gen("button");
        closeBtn.classList.add("button");
        closeBtn.type = "button";
        closeBtn.id = "close-btn";
        closeBtn.addEventListener("click", () =>
            id("room-detail-view").classList.toggle("hidden"));
        closeBtn.textContent = "Close";
        roomInfo.appendChild(closeBtn);
    }

    function changeView() {
        id("display-list").classList.toggle("hidden");
        id("display-tile").classList.toggle("hidden");
    }

    function displayList(rooms) {
        id("num-results").textContent = rooms.length;
        let listView = id("list-view");
        listView.innerHTML = "";
        for (let room of rooms) {
            listView.appendChild(createListItem(room, rooms));
        }
    }

    function displayTile(rooms) {
        id("num-results").textContent = rooms.length;
        let tileView = id("tile-view");
        tileView.innerHTML = "";
        for (let room of rooms) {
            tileView.appendChild(createTileItem(room, rooms));
        }
    }

    function createListItem(room, testRooms) {
        let roomItem = gen("div");
        roomItem.value = room.number;
        roomItem.classList.add("room-item-list");

        let roomNumber = gen("div");
        roomNumber.classList.add("room-number-list");
        let num = gen("h3");
        num.textContent = "Room N° " + room.number;
        roomNumber.appendChild(num);
        roomItem.appendChild(roomNumber);

        let roomType = gen("div");
        roomType.classList.add("room-type-list");
        let type = gen("h3");
        type.textContent = "Room Type: " + room.type;
        roomType.appendChild(type);
        roomItem.appendChild(roomType);

        let roomRate = gen("div");
        roomRate.classList.add("room-rate-list");
        let rate = gen("h3");
        rate.textContent = "Room Rate: $" + room.rate + "/night";
        roomRate.appendChild(rate);
        roomItem.appendChild(roomRate);

        let bookBtn = gen("button");
        bookBtn.classList.add("room-button");
        bookBtn.id = "book-btn-list";
        bookBtn.addEventListener("click", () => chooseRoom(room.number, testRooms));
        bookBtn.type = "button";
        bookBtn.textContent = "Book Now";
        bookBtn.style.color = "#a4a2a2";
        roomItem.appendChild(bookBtn);

        return roomItem;
    }

    function createTileItem(room, testRooms) {
        let roomItem = gen("div");
        roomItem.value = room.number;
        roomItem.classList.add("room-item-tile");

        let roomNumber = gen("div");
        roomNumber.classList.add("room-number-tile");
        let num = gen("h3");
        num.textContent = "Room N° " + room.number;
        roomNumber.appendChild(num);
        roomItem.appendChild(roomNumber);

        let roomButton = gen("div");
        roomButton.classList.add("room-button");
        let bookBtn = gen("button");
        bookBtn.id = "book-btn-tile";
        bookBtn.addEventListener("click", () => chooseRoom(room.number, testRooms));
        bookBtn.type = "button";
        bookBtn.textContent = "Book Now";
        bookBtn.style.color = "#a4a2a2";
        roomButton.appendChild(bookBtn);
        roomItem.appendChild(roomButton);

        let roomType = gen("div");
        roomType.classList.add("room-type-tile");
        let type = gen("h3");
        type.textContent = "Room Type: " + room.type;
        roomType.appendChild(type);
        roomItem.appendChild(roomType);

        let roomRate = gen("div");
        roomRate.classList.add("room-rate-tile");
        let rate = gen("h3");
        rate.textContent = "Room Rate: $" + room.rate + "/night";
        roomRate.appendChild(rate);
        roomItem.appendChild(roomRate);

        return roomItem;
    }

    async function statusCheck3(res) {
        if (!res.ok) {
            throw new Error(await res.json());
        }
        return res;
    }

    async function statusCheck2(res) {
        if (!res.ok) {
            id("submit-text-msg").textContent = "Invalid username or password. Please try again.";
            throw new Error(await res.text());
        }
        return res;
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