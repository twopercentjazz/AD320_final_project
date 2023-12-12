/*
 *
 */
"use strict";

(function() {
    window.addEventListener("load", init);

    function init() {
        id("check").addEventListener("click", checkAvailability);
        displayRooms().then(rooms => {
            displayList(rooms);
        });
        displayRooms().then(rooms => {
            displayTile(rooms);
        });
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
        id("search-btn").addEventListener("click",  function(event) {
            event.preventDefault();
            SearchRooms();
        });
        id("filter-btn").addEventListener('click', function(event) {
            event.preventDefault();
            filterResults();
            let roomType = Array.from(qsa('input[name="type"]:checked')).map(e => e.value);
            let bedType = Array.from(qsa('input[name="bed"]:checked')).map(e => e.value);
            let bedCount = Array.from(qsa('input[name="count"]:checked')).map(e => e.value);
            let filters = {
                bedCount: bedCount,
                roomType: roomType,
                bedType: bedType
            };
            let queryString = Object.entries(filters)
                .flatMap(([key, values]) => values.map(value => `${key}=${value}`))
                .join('&');
            if (!noneChecked()) {
                fetch("http://localhost:8000/room-filter?" + queryString)
                    .then(statusCheck)
                    .then(response => response.json())
                    .then(response => {
                        console.log(JSON.stringify(response));
                        displayList(response);
                        displayTile(response);
                    })
            }
        });
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
        let checkboxes = qsa('#filter-form input[type="radio"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        displayRooms().then(rooms => {
            displayList(rooms);
        });
        displayRooms().then(rooms => {
            displayTile(rooms);
        });
    }

    async function getRoomList() {
        return fetch("http://localhost:8000/rooms")
            .then(statusCheck)
            .then(response => response.json())
            .catch(console.log);
    }

    async function displayRooms() {
        return await getRoomList();
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
            window.location.href = "booking.html";
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

    function showListDetails(event, testRooms) {
        let room = event.target.closest(".room-item-list");
        if (room !== null) {
            createRoomDetail(testRooms[getIndex(room.value, testRooms)]);
            id("room-detail-view").classList.toggle("hidden");
        }
    }

    function showTileDetails(event, testRooms) {
        let room = event.target.closest(".room-item-tile");
        if (room !== null) {
            createRoomDetail(testRooms[getIndex(room.value, testRooms)]);
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

    function createRoomDetail(room) {
        let roomDetail = id("room-detail");
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

        let roomBtn = gen("button");
        roomBtn.classList.add("button");
        roomBtn.addEventListener("click", () =>
            id("room-detail-view").classList.toggle("hidden"));
        roomBtn.type = "button";
        roomBtn.id = "close-btn";
        roomBtn.textContent = "Close";
        roomInfo.appendChild(roomBtn);
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
            listView.appendChild(createListItem(room));
        }
    }

    function displayTile(rooms) {
        id("num-results").textContent = rooms.length;
        let tileView = id("tile-view");
        tileView.innerHTML = "";
        for (let room of rooms) {
            tileView.appendChild(createTileItem(room));
        }
    }

    function createListItem(room) {
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

        return roomItem;
    }

    function createTileItem(room) {
        let roomItem = gen("div");
        roomItem.value = room.number;
        roomItem.classList.add("room-item-tile");

        let roomNumber = gen("div");
        roomNumber.classList.add("room-number-tile");
        let num = gen("h3");
        num.textContent = "Room N° " + room.number;
        roomNumber.appendChild(num);
        roomItem.appendChild(roomNumber);

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

    /**
     * Returns the response's result text if successful, otherwise
     * returns the rejected Promise result with an error status and corresponding text
     * @param {object} res - response to check for success/error
     * @return {object} - valid response if response was successful, otherwise rejected
     *                    Promise result
     */
    async function statusCheck(res) {
        if (!res.ok) {
            throw new Error(await res.json());
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