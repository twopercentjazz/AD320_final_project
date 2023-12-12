/*
 *
 */
'use strict';

const express = require('express');
const {format} = require('path');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const cookieParser = require('cookie-parser');
const multer = require('multer');
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(multer().none());

/**
 * Takes values and checks if they exist and aren't empty.
 * @param input Value(s). Rare occasion where I appreciate javascript having dynamic typing.
 * @returns {boolean} Whether or not the values are empty.
 */
function isEmpty(...input) {
    for (const val of input) {
        if (val === null || val === undefined || val.length === 0 || val === 'null') {
            return true;
        }
    }
    return false;
}

/**
 * Generates a random 16 digit integer (as a string) and inserts it for the given user.
 * Yes, I know labels are frowned upon. This could be re-written in a number of ways to avoid it, but frankly I think
 * this is the cleanest option that I've considered.
 * @param base A database connection.
 * @param user The user to give a sessionId to.
 * @returns {Promise<string>} The unique sessionId.
 */
async function createSessionId(base, user) {
    let sessionId = Math.random().toString().substring(2, 18);
    let query = "SELECT sessionid FROM users";
    let ids = await base.all(query);
    let safe = false;
    checkLoop: while (!safe) {
        for (const val of ids) {
            if (val["sessionid"] === sessionId) {
                sessionId = Math.random().toString().substring(2, 18);
                continue checkLoop;
            }
        }
        safe = true;
    }

    let insertion = "UPDATE users SET sessionid=? WHERE user=?";
    await base.run(insertion, [sessionId, user], (error) => {
        if (error) {
            console.log("Does this ever trigger?");
        }
    });
    return sessionId
}

/**
 * Returns a (promise for a) database connection.
 * @returns {Promise<Database<Database, Statement>>} Promise for a database connection.
 */
async function getDBConnection() {
    return await sqlite.open({
        filename: 'overlook-hotel.db', driver: sqlite3.Database
    });
}

app.post("/create-user-full", async (req, res) => {
    if (isEmpty(req.body.username, req.body.password, req.body.name, req.body.email, req.body.phone, req.body.address, req.body.city, req.body.state, req.body.code)) {
        return res.status(400).send("Missing a required parameter");
    }
    let base = await getDBConnection();
    await newUser(base, req, res);
    if(res.statusCode === 200){
        let info = await newUserInfo(base, req, res);
        if(res.statusCode === 200) {
            res.send("New user successfully created.");
        } else {
            res.send("User added, but error attempting to add user information.")
        }
    } else {
        res.send("User not added, may already exist or a parameter may be improperly formatted");
    }
    await base.close();
});

async function newUser(base, req, res){
    let addQuery = "INSERT INTO users (user, code, name, email) VALUES (?, ?, ?, ?)";
    try {
        let info = await base.run(addQuery, [req.body.username, req.body.password, req.body.name, req.body.email]);
    } catch (error) {
        res.status(500);
    }
}

async function newUserInfo(base, req, res){
    let idQuery = "SELECT id FROM users WHERE user=?";
    let userID = await base.get(idQuery, [req.body.username]);
    let infoStatement = "INSERT INTO info (id, phone, address, city, state, code) VALUES (?,?,?,?,?,?)";
    try {
        let info = await base.run(infoStatement, [userID["id"], req.body.phone, req.body.address, req.body.city, req.body.state, req.body.code]);
    } catch (error) {
        res.status(500);
    }
}

/**
 * Creates a new user. Requires a unique username, a password, a name, and an email. Values can not be empty/null.
 * If a user with a given username already exists, fails with a 400 status code.
 * While there's a strong argument for checking if a user exists before inserting, that leads to a potential race
 * condition where a user isn't found, another connection adds a user, and then this fails. Instead, this simply catches
 * a failed attempt. Added bonus of avoiding a (relatively) expensive query.
 */
app.post("/create-user", async (req, res) => {
    if (isEmpty(req.body.username, req.body.password, req.body.name, req.body.email)) {
        return res.status(400).send("Missing a required parameter");
    }
    let addQuery = "INSERT INTO users (user, code, name, email) VALUES (?, ?, ?, ?)";
    let base = await getDBConnection();
    try {
        await base.run(addQuery, [req.body.username, req.body.password, req.body.name, req.body.email], (error) => {
            if (error) {
                console.log("Does this ever trigger?");
                return res.status(500).send("Internal error.");
            }
        });
        res.status(200).send("User successfully created.")
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT") {
            res.status(400).send("User already exists.");
        } else {
            res.status(500).send("Internal error.");
        }
    }
    await base.close();
});

/**
 * Logs a user in. Requires a valid (and thus, non-empty) username and password. Returns cookies for a unique sessionId
 * as well as the user's username.
 */
app.post("/login", async (req, res) => {
    if (isEmpty(req.body.username, req.body.password)) {
        return res.status(400).send("Missing a required field.");
    }
    let query = "SELECT user,code FROM users WHERE user=?";
    let base = await getDBConnection();
    let user = await base.get(query, [req.body.username], (error) => {
        if (error) {
            console.log("Does this ever trigger?");
            return res.status(500).send("Internal error");
        }
    });
    if (isEmpty(user)) {
        res.status(400).send("User not found");
    } else if (user['code'] !== req.body.password) {
        res.status(400).send("Invalid credentials");
    } else {
        let id = await createSessionId(base, req.body.username);
        res.cookie("sessionId", id, {maxAge: 2592000000}); //Roughly a month
        res.cookie("username", req.body.username, {maxAge: 2592000000})
        res.status(200).send("Successfully logged in.");
    }
    await base.close();
});

/**
 * Removes the sessionId cookie, if it exists, and logs a user out.
 */
app.post("/logout", async (req, res) => {
    if (isEmpty(req.cookies.sessionId)) {
        res.status(200).send("Already logged out");
    } else {
        res.clearCookie("sessionId");
        res.status(200).send("Successfully logged out");
    }
});

/**
 * Checks if the user is currently logged in by checking the user's sessionId cookie, if any, against the one in the
 * database.
 */
app.get("/activity-check", async (req, res) => {
    if (isEmpty(req.cookies.username, req.cookies.sessionId)) {
        return res.status(200).send("false");
    }
    let base = await getDBConnection();
    if (!await activeCheck(base, req.cookies.username, req.cookies.sessionId)) {
        res.status(200).send("false");
    } else {
        res.status(200).send("true")
    }
    await base.close();
});

/**
 * Function to check if a user is logged in with an active session.
 * First check is currently redundant, may be removed.
 * @param base Connection to the database.
 * @param user The user to check.
 * @param sessionId The users sessionId.
 * @returns {Promise<boolean>} Whether or not the user is logged in (promise).
 */
async function activeCheck(base, user, sessionId) {
    if (isEmpty(user, sessionId)) {
        return false;
    }
    let query = "SELECT user,sessionid from users WHERE user=?";
    let result = await base.get(query, [user]);
    return (!isEmpty(result) && result["sessionid"] == sessionId);
}

app.get("/user-info", async (req, res) => {
    if (isEmpty(req.cookies.username, req.cookies.sessionId)) {
        return res.status(400).send("false");
    }
    let base = await getDBConnection();
    let query = "SELECT * FROM users WHERE user=?";
    let userInfo = await base.get(query, [req.cookies.username], (error) => {
        if (error) {
            console.log("Does this ever trigger?");
            return res.status(500).send("Internal error");
        }
    });
    res.status(200).json(userInfo);
    await base.close();
});

app.get("/user-all-info", async (req, res) => {
    if (isEmpty(req.cookies.username, req.cookies.sessionId)) {
        return res.status(400).send("false");
    }
    let base = await getDBConnection();
    let query = "SELECT u.\"id\",u.\"user\",u.\"name\",u.\"email\",i.\"phone\",i.\"address\",i.\"city\",i.\"state\",i.\"code\"\n" +
        "FROM \"users\" u\n" +
        "JOIN \"info\" i ON i.\"id\"=u.\"id\"\n" +
        "WHERE u.\"user\"=?";
    let result = await base.get(query, [req.cookies.username]);
    res.status(200).json(result);
    await base.close();
});

/**
 * Checks if a user is logged in, and then returns all of that users transactions.
 */
app.get("/user-reservations", async (req, res) => {
    if (isEmpty(req.cookies.username, req.cookies.sessionId)) {
        return res.status(401).send("No active session found");
    }
    let base = await getDBConnection();
    if (!await activeCheck(base, req.cookies.username, req.cookies.sessionId)) {
        res.status(401).send("No active session found.");
    } else {
        // let query = "SELECT * FROM trans WHERE user=?";
        let query = "SELECT t.id,u.user,r.number AS 'room',t.confirm,date(t.date,'unixepoch') AS 'reserved',date(t.ckin,'unixepoch') AS 'ckin',date(t.ckout,'unixepoch') AS 'ckout',t.occupants,CAST((t.cost/100) AS REAL) AS 'cost'\n" +
            "FROM trans t\n" +
            "JOIN users u ON u.id=t.user\n" +
            "JOIN rooms r ON r.number=t.room\n" +
            "WHERE u.user=?";
        let transactions = await base.all(query, [req.cookies.username], (error) => {
            if (error) {
                console.log("Does this ever trigger?");
                return res.status(500).send("Internal error");
            }
        });
        res.status(200).json(transactions);
    }
    await base.close();
});

app.get("/past-reservations", async (req, res) => {
    if (isEmpty(req.cookies.username, req.cookies.sessionId)) {
        return res.status(401).send("No active session found");
    }
    let base = await getDBConnection();
    let query = "SELECT t.id,u.user,r.number AS 'room',t.confirm,date(t.date,'unixepoch') AS 'reserved',date(t.ckin,'unixepoch') AS 'ckin',date(t.ckout,'unixepoch') AS 'ckout',t.occupants,CAST((t.cost/100) AS REAL) AS 'cost'\n" +
        "FROM trans t\n" +
        "JOIN users u ON u.id=t.user\n" +
        "JOIN rooms r ON r.number=t.room\n" +
        "WHERE u.user=? AND t.ckout<unixepoch('now');";
    let transactions = await base.all(query, [req.cookies.username, Date.now()]);
    res.status(200).json(transactions);
    await base.close();
});

app.get("/future-reservations", async (req, res) => {
    if (isEmpty(req.cookies.username, req.cookies.sessionId)) {
        return res.status(401).send("No active session found");
    }
    let base = await getDBConnection();
    let query = "SELECT t.id,u.user,r.number AS 'room',t.confirm,date(t.date,'unixepoch') AS 'reserved',date(t.ckin,'unixepoch') AS 'ckin',date(t.ckout,'unixepoch') AS 'ckout',t.occupants,CAST((t.cost/100) AS REAL) AS 'cost'\n" +
        "FROM trans t\n" +
        "JOIN users u ON u.id=t.user\n" +
        "JOIN rooms r ON r.number=t.room\n" +
        "WHERE u.user=? AND t.ckout>unixepoch('now');";
    let transactions = await base.all(query, [req.cookies.username]);
    res.status(200).json(transactions);
    await base.close();
});

app.post("/reserve", async (req, res) => {
    if (isEmpty(req.cookies.username, req.cookies.sessionId, req.body.room, req.body.checkIn, req.body.checkOut, req.body.occupants)) {
        return res.status(400).send("Missing required information.");
    }
    let base = await getDBConnection();
    if (!await activeCheck(base, req.cookies.username, req.cookies.sessionId)) {
        res.status(401).send("No active session found.");
    } else {
        let roomCheck = "SELECT * FROM rooms WHERE number=?";
        let room = await base.get(roomCheck, [req.body.room]);
        if (isEmpty(room)) {
            res.status(400).send("Room not found");
        } else {
            //Should really attempt to verify things
            let confirmationNumber = Math.random().toString().substring(2, 18);
            let idQuery = "SELECT id FROM users WHERE user=?";
            let userId = await base.get(idQuery, [req.cookies.username]);
            let reservationStatement = "INSERT INTO trans (user, room, confirm, date, ckin, ckout, occupants, cost) VALUES" + "(?,?,?,unixepoch(date()),unixepoch(?),unixepoch(?),?, ((julianday(?) - julianday(?)) * ?))";
            let reservation = await base.run(reservationStatement, [userId["id"], req.body.room, confirmationNumber, req.body.checkIn, req.body.checkOut, req.body.occupants, req.body.checkOut, req.body.checkIn, room["rate"]]);
            if (isEmpty(reservation)) {
                res.status(400).send("Something went wrong");
            } else {
                res.status(200).send(confirmationNumber);
            }
        }
    }
    await base.close();
});

/**
 * Returns effectively the entire rooms table.
 */
app.get("/rooms", async (req, res) => {
    // let query = "SELECT * FROM rooms";
    let query = "SELECT r.number,r.max,r.type,r.bed,r.count,CAST((r.rate/100) AS REAL) AS 'rate',p.picture\n" +
        "FROM rooms r,pictures p\n" +
        "WHERE p.id=r.picture;";
    let base = await getDBConnection();
    let rooms = await base.all(query, [], (error) => {
        if (error) {
            console.log("Does this ever trigger?");
            return res.status(500).send("Internal error");
        }
    });
    //Result checking?
    res.status(200).json(rooms);
    await base.close();
});

app.get("/room-info/:number", async (req, res) => {
    // let query = "SELECT * FROM rooms WHERE number=?";
    let query = "SELECT r.\"number\",r.\"max\",r.\"type\",r.\"bed\",r.\"count\",CAST((r.\"rate\"/100) AS REAL) AS 'rate',p.\"picture\"\n" + "FROM \"rooms\" r\n" + "JOIN \"pictures\" p ON p.\"id\"=r.\"picture\"\n" + "WHERE r.\"number\"=?;";
    let base = await getDBConnection();
    let room = await base.get(query, [req.params.number], (error) => {
        if (error) {
            console.log("Does this ever trigger?");
            return res.status(500).send("Internal error");
        }
    });
    if (isEmpty(room)) {
        res.status(200).send("Room not found.");
    } else {
        res.status(200).json(room);
    }
    await base.close();
});

app.get("/room-filter", async (req, res) => {
    await filter(req.query, res);
});

app.post("/room-filter", async (req, res) => {
    await filter(req.body, res);
});

// added param to get bed count to work
app.get("/room-filter/:bedCount/:guests/:roomType/:bedType/:checkin/:checkout", async (req, res) => {
    await filter(req.params, res);
});

app.get("/search", async (req, res) => {
    let search = req.query.input.toLowerCase().split(' ');
    let params = {
        guests: [],
        roomType: [],
        bedType: [],
        bedCount: [],
        checkIn: [],
        checkOut: []
    };

    for (const i in search){
        let index = Number.parseInt(i);
        if (Number.isInteger(Number.parseInt(search[index]))){
            if (index < search.length - 1){
                let nextToken = search[index+1];
                if(nextToken.includes("bed")){
                    params.bedCount.push(search[index]);
                    continue;
                }
                if (nextToken.includes("guest") || nextToken.includes("people") || nextToken.includes("person") || nextToken.includes("occupant")){
                    params.guests.push(search[index]);
                    continue;
                }
            }

            if(search[index].length === 10 && Date.parse(search[index]) > Date.now()){
                if(isEmpty(params.checkIn)){
                    params.checkIn = search[index];
                } else if(isEmpty(params.checkOut)){
                    params.checkOut = search[index];
                }
            }
        }

        let val = search[i];
        switch (val){
            case 'economy':
                params.roomType.push('Economy');
                break;
            case 'standard':
                params.roomType.push('Standard');
                break;
            case 'deluxe':
                params.roomType.push('Deluxe');
                break;
            case 'suite':
                params.roomType.push('Suite');
                break;
            case 'twin':
                params.bedType.push('Twin');
                break;
            case 'full':
                params.bedType.push('Full');
                break;
            case 'queen':
                params.bedType.push('Queen');
                break;
            case 'king':
                params.bedType.push('King');
                break;
            default:
        }
    }
    await filter(params, res);
});

async function filter(values, res){
    let params = queryBuilder(values)
    let query = params.pop();
    if(params.length < 1){
        return res.status(400).send("No filter values found.")
    }
    let base = await getDBConnection();
    try{
        let rooms = await base.all(query, params);
        res.status(200).json(rooms);
    } catch (error){
        console.log(error);
        res.status(500)
    }
    await base.close();
}

function valueBuilder(values, params, query, snip){
    query += " (";
    let bits = [];
    for (const val of values){
        if (val == ","){
            continue;
        }
        bits.push(snip);
        params.push(val);
        bits.push(" OR");
    }
    bits.pop();
    for (const val of bits){
        query += val;
    }
    query += ")"

    return [query, params];
}

function queryBuilder(values){
    let baseQuery = "SELECT r.number,r.max,r.type,r.bed,r.count,CAST((r.rate/100) AS REAL) AS 'rate',p.picture\n" +
        "FROM rooms r\n" +
        "JOIN pictures p ON p.id=r.picture\n" +
        "WHERE";
    let params = [];
    if(!isEmpty(values.guests)){
        let guestSnip = " r.max>=?";
        let vals = valueBuilder(values.guests, params, baseQuery, guestSnip);
        baseQuery = vals[0];
        params = vals[1];
    }

    // added this for bed count param from your old implementation
    if(!isEmpty(values.bedCount)){
        if(params.length > 0){
            baseQuery += " AND";
        }
        baseQuery += " r.count=?";
        params.push(values.bedCount);
    }

    if(!isEmpty(values.roomType)){
        if(params.length > 0){
            baseQuery += " AND";
        }
        let roomSnip = " r.type=?";
        let vals = valueBuilder(values.roomType, params, baseQuery, roomSnip);
        baseQuery = vals[0];
        params = vals[1];
    }
    if(!isEmpty(values.bedType)){
        if(params.length > 0){
            baseQuery += " AND";
        }
        let bedSnip = " r.bed=?";
        let vals = valueBuilder(values.bedType, params, baseQuery, bedSnip);
        baseQuery = vals[0];
        params = vals[1];
    }
    if(!isEmpty(values.bedCount)){
        if(params.length > 0){
            baseQuery += " AND";
        }
        let bedSnip = " r.count=?";
        let vals = valueBuilder(values.bedCount, params, baseQuery, bedSnip);
        baseQuery = vals[0];
        params = vals[1];
    }
    if(!isEmpty(values.checkIn, values.checkOut)){
        if(params.length > 0){
            baseQuery += " AND";
        }
        baseQuery += " (r.number NOT IN (SELECT t.room FROM trans t\n" +
            "WHERE unixepoch(?) BETWEEN t.ckin AND (t.ckout-86400)))\n" +
            "AND (r.number NOT IN (SELECT t.room FROM trans t\n" +
            "WHERE (unixepoch(?)-86400) BETWEEN t.ckin AND (t.ckout-86400)))";
        // baseQuery += " (r.number IN (SELECT t.room FROM trans t WHERE unixepoch(?) >= t.ckout))\n" +
        //     "OR (r.number IN (SELECT t.room FROM trans t WHERE unixepoch(?) <= t.ckin))";
        params.push(values.checkIn);
        params.push(values.checkOut);
    }
    params.push(baseQuery);
    return params;
}

app.get("/available-rooms", async (req, res) => {
    let base = await getDBConnection();
    let query = "SELECT r.number,r.max,r.type,r.bed,r.count,CAST((r.rate/100) AS REAL) AS 'rate',p.picture\n" +
        "FROM rooms r\n" +
        "JOIN pictures p ON p.id=r.picture\n" +
        "WHERE ?<=r.max\n" +
        "AND (r.number NOT IN (\n" +
        "\tSELECT t.room\n" +
        "\tFROM trans t\n" +
        "\tWHERE unixepoch(?) BETWEEN t.ckin AND (t.ckout-86400))\n" +
        ")\n" +
        "AND (r.number NOT IN (\n" +
        "\tSELECT t.room\n" +
        "\tFROM trans t\n" +
        "\tWHERE (unixepoch(?)-86400) BETWEEN t.ckin AND (t.ckout-86400))\n" +
        ")";
    let rooms = await base.all(query, [req.query.guests, req.query.checkin, req.query.checkout]);
    res.status(200).json(rooms);
    await base.close();
});

//TODO: DO NOT USE PAST THIS POINT


app.post("/update-user-info", async (req, res) => {
    if (isEmpty(req.cookies.username, req.cookies.sessionId)) {
        return res.status(400).send("Must be logged in to change user information.");
    }
   let statement = "INSERT INTO info (";
   let params = [];
   if(req.body.phone){
       statement += "phone,";
       params.push(req.body.phone);
   }
   if(req.body.address){
       statement += "address,";
       params.push(req.body.address);
   }
    if(req.body.city){
        statement += "city,";
        params.push(req.body.city);
    }
    if(req.body.state){
        statement += "state,";
        params.push(req.body.state);
    }
    if(req.body.code){
        statement += "code,";
        params.push(req.body.code);
    }
    if(params.length === 0){
        return res.status(200).send("No valid values given.");
    }
    statement = statement.slice(0, -1); //Kills the last comma. What we lose in efficiency, we gain in simplicity.
    statement += ") VALUES (";

   for(let i= 0; i < params.length - 1;i++){
       statement += "?, ";
    }
   statement += "?)";
   let base = await getDBConnection();
   let idQuery = "SELECT id FROM users WHERE user=?";
   let userID = await base.get(idQuery, [req.cookies.username]);
   let infoUpdate = await base.run(statement, params);
   res.status(200).send("User information updated successfully.");
});

async function availableCheck(base, room, checkIn, checkOut) {
    let availableCheck = "SELECT (ckin,ckout) FROM trans WHERE room=?";
    let reservations = await base.all(availableCheck, [room]);
    let inDate = dateToEpoch(checkIn);
    let outDate = dateToEpoch(checkOut);
    let safe = true;
    for (const val in reservations) {
        if (inDate > val["ckin"] && inDate < val["ckout"]) {
            safe = false;
            // res.status(400).send("Room is already reserved for that period");
        }
    }
}

/**
 * Takes a number in Unix Epoch time (assumed to be UTC) and converts to ISO 8601 Date format in local time.
 * @param time The number to parse.
 * @returns {Promise<string>} Promise for a time in human-readable form.
 */
async function epochToDate(time) {
    let base = await getDBConnection();
    let timeQuery = "SELECT date(?, 'unixepoch', 'localtime')"
    let newTime = await base.get(timeQuery, [time]);
    await base.close();
    return JSON.stringify(newTime["date(?, 'unixepoch', 'localtime')"]);
}

/**
 * Takes a string in ISO 8610 Date format (assumed to be in local time) and converts to UTC Unix Epoch time.
 * @param time The string to parse.
 * @returns {Promise<string>} Promise for a time in Unix Epoch format.
 */
async function dateToEpoch(time) {
    let base = await getDBConnection();
    let timeQuery = "SELECT unixepoch(?, 'utc')";
    let newTime = await base.get(timeQuery, [time]);
    await base.close();
    return JSON.stringify(newTime["unixepoch(?, 'utc')"]);
}

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);