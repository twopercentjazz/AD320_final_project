/*
 *
 */
"use strict";

(function() {
    const loggedIn = true;
    window.addEventListener("load", init);

    function init() {
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


        id("nullLink").addEventListener("click",  (e) => {
            e.preventDefault();
        });


        let currFilter = "none";
        id("filter-btn1").addEventListener("click", () => {
            if (currFilter === "filters") {
                toggleFilters();
            } else if (currFilter === "views") {
                toggleViews();
            }
            toggleSearch();
            currFilter = "search";
        });

        id("filter-btn2").addEventListener("click", () => {
            toggleSearch();
            currFilter = "none";
        });

        id("filter-btn3").addEventListener("click", () => {
            if (currFilter === "search") {
                toggleSearch();
            } else if (currFilter === "views") {
                toggleViews();
            }
            toggleFilters();
            currFilter = "filters";
        });

        id("filter-btn4").addEventListener("click", () => {
            toggleFilters();
            currFilter = "none";
        });

        id("filter-btn5").addEventListener("click", () => {
            if (currFilter === "filters") {
                toggleFilters();
            } else if (currFilter === "search") {
                toggleSearch();
            }
            toggleViews();
            currFilter = "views";
        });

        id("filter-btn6").addEventListener("click", () => {
            toggleViews();
            currFilter = "none";
        });




        let testRooms = [
            {
                id: "1",
                number: "237",
                max: "2",
                type: "Suite",
                bed: "King",
                count: "1",
                rate: "250",
                picture: "/public/assets/img/rooms/suite/1king.png"
            },
            {
                id: "2",
                number: "217",
                max: "2",
                type: "Deluxe",
                bed: "King",
                count: "1",
                rate: "200",
                picture: "/public/assets/img/rooms/deluxe/1king.png"
            },
            {
                id: "3",
                number: "115",
                max: "4",
                type: "Standard",
                bed: "Queen",
                count: "2",
                rate: "180",
                picture: "/public/assets/img/rooms/standard/2queen.png"
            },
            {
                id: "4",
                number: "130",
                max: "1",
                type: "Economy",
                bed: "Twin",
                count: "1",
                rate: "90",
                picture: "/public/assets/img/rooms/economy/1twin.png"
            }];



        displayList(testRooms);
        displayTile(testRooms);
        qsa("#view-form input").forEach(view => view.addEventListener("change", changeView));
        id("display-list").addEventListener("click", () => showListDetails(event, testRooms));
        id("display-tile").addEventListener("click", () => showTileDetails(event, testRooms));




        // start for filters
        id("filter-btn").addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the form from submitting

            let roomType = Array.from(qsa('input[name="room-type"]:checked')).map(e => e.value);
            let bedType = Array.from(qsa('input[name="bed-type"]:checked')).map(e => e.value);
            let bedCount = Array.from(qsa('input[name="bed-count"]:checked')).map(e => e.value);

            let filters = {
                type: roomType,
                bed: bedType,
                count: bedCount
            };

            let json = JSON.stringify(filters);

            console.log(json); // Output the JSON string to the console
        });
        // end for filters
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

        /*
        let roomImg = gen("img");
        roomImg.src = room.picture;
        roomImg.alt = room.type + " room";
        roomItem.appendChild(roomImg);



        let roomInfo = gen("div");
        roomInfo.classList.add("room-info");
        roomItem.appendChild(roomInfo);

        let roomNum = gen("h3");
        roomNum.textContent = room.number;
        roomInfo.appendChild(roomNum);

        let roomType = gen("p");
        roomType.textContent = room.type;
        roomInfo.appendChild(roomType);

        let roomBed = gen("p");
        roomBed.textContent = room.bed + " bed";
        roomInfo.appendChild(roomBed);

        let roomMax = gen("p");
        roomMax.textContent = "Max " + room.max + " people";
        roomInfo.appendChild(roomMax);

        let roomRate = gen("p");
        roomRate.textContent = "$" + room.rate + "/night";
        roomInfo.appendChild(roomRate);




        let roomBtn = gen("button");
        roomBtn.textContent = "Book Now";
        roomInfo.appendChild(roomBtn);

        return roomItem;

         */

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

    function toggleSearch() {
        id("show-search").classList.toggle("hidden");
        id("hide-search").classList.toggle("hidden");
        id("search-section").classList.toggle("hidden");
    }

    function toggleFilters() {
        id("show-filters").classList.toggle("hidden");
        id("hide-filters").classList.toggle("hidden");
        id("filters-section").classList.toggle("hidden");
    }

    function toggleViews() {
        id("show-views").classList.toggle("hidden");
        id("hide-views").classList.toggle("hidden");
        id("views-section").classList.toggle("hidden");
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