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
 * Creates a new user. Requires a unique username, a password, a name, and an email. Values can not be empty/null.
 * If a user with a given username already exists, fails with a 400 status code.
 * While there's a strong argument for checking if a user exists before inserting, that leads to a potential race
 * condition where a user isn't found, another connection adds a user, and then this fails. Instead, this simply catches
 * a failed attempt. Added bonus of avoiding a (relatively) expensive query.
 */
app.post("/create-user", async (req, res) => {
    if (isEmpty(req.body.username, req.body.password, req.body.name, req.body.email)){
        return res.status(400).send("Missing a required parameter");
    }
    let addQuery = "INSERT INTO users (user, code, name, email) VALUES (?, ?, ?, ?)";
    let base = await getDBConnection();
    try {
        await base.run(addQuery, [req.body.username, req.body.password, req.body.name, req.body.email], (error) => {
            if (error) {
                console.log("Does this ever trigger?");
                return res.status(500).send("Internal error.");            }
        });
        res.status(200).send("User successfully created.")
    } catch (error){
        if(error.code === "SQLITE_CONSTRAINT"){
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
    if(isEmpty(req.body.username, req.body.password)){
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
    if(isEmpty(user)){
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
    if(isEmpty(req.cookies.sessionId)){
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
    if(isEmpty(req.cookies.username, req.cookies.sessionId)){
        return res.status(200).send("false");
    }
    let base = await getDBConnection();
    if(!await activeCheck(base, req.cookies.username, req.cookies.sessionId)){
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
async function activeCheck(base, user, sessionId){
    if(isEmpty(user, sessionId)){
        return false;
    }
    let query = "SELECT user,sessionid from users WHERE user=?";
    let result = await base.get(query, [user]);
    return (!isEmpty(result) && result["sessionid"] == sessionId);
}

/**
 * Returns effectively the entire rooms table.
 */
app.get("/rooms", async (req, res) => {
    let query = "SELECT * FROM rooms";
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

app.get("/user-info", async (req, res) => {
    if(isEmpty(req.cookies.username, req.cookies.sessionId)){
        return res.status(400).send("false");
    }
    let base = await getDBConnection();
    let query = "SELECT * FROM users WHERE user=?";
    let userInfo = await base.get(query, [], (error) => {
        if (error) {
            console.log("Does this ever trigger?");
            return res.status(500).send("Internal error");
        }
    });
    res.status(200).json(userInfo);
    await base.close();
});

//TODO: There definitely will be errors here, patch up.
app.get("/room-info/:number", async (req, res) => {
    let query = "SELECT * FROM rooms WHERE number=?";
    let base = await getDBConnection();
    let room = await base.get(query, [req.params.number], (error) => {
        if (error) {
            console.log("Does this ever trigger?");
            return res.status(500).send("Internal error");
        }
    });
    res.status(200).json(room);
    await base.close();
});

/**
 * Checks if a user is logged in, and then returns all of that users transactions.
 * TODO: Test success and fail conditions.
 */
app.get("/user-reservations", async (req, res) => {
    if(isEmpty(req.cookies.username, req.cookies.sessionId)){
        return res.status(401).send("No active session found");
    }
    let base = await getDBConnection();
    if(!await activeCheck(base, req.cookies.username, req.cookies.sessionId)){
        res.status(401).send("No active session found.");
    } else {
        let query = "SELECT * FROM trans WHERE user=?";
        let transactions = await base.all(query, [req.cookies.username], (error) => {
            if (error) {
                console.log("Does this ever trigger?");
                return res.status(500).send("Internal error");        }
        });
        res.status(200).json(transactions);
    }
    await base.close();
});

//Subtle issue with a discrepancy between Date.now() being the actual time, and the stored times being standardized
//part of the day due to rounding and the differences between timezones.
app.get("/past-reservations", async (req, res) => {
    if(isEmpty(req.cookies.username, req.cookies.sessionId)){
        return res.status(401).send("No active session found");
    }
    let base = await getDBConnection();
    let query = "SELECT * FROM trans WHERE user=? AND WHERE ckout<?";
    let transactions = await base.all(query, [req.cookies.username, Date.now()])
});

//Subtle issue with a discrepancy between Date.now() being the actual time, and the stored times being standardized
//part of the day due to rounding and the differences between timezones.
app.get("/future-reservations", async (req, res) => {
    if(isEmpty(req.cookies.username, req.cookies.sessionId)){
        return res.status(401).send("No active session found");
    }
    let base = await getDBConnection();
    let query = "SELECT * FROM trans WHERE user=? AND WHERE ckout>?";
    let transactions = await base.all(query, [req.cookies.username, Date.now()])
});

//TODO: Finish
app.post("/reserve", async (req, res) => {
    if(isEmpty(req.cookies.username, req.cookies.sessionId, req.body.param)){
    }
    let base = await getDBConnection();
    if(!await activeCheck(base, req.cookies.username, req.cookies.sessionId)){
        res.status(401).send("No active session found.");
    } else {

        //do the thing.
    }
    await base.close();
});

/**
 * Takes values and checks if they exist and aren't empty.
 * @param input Value(s). Rare occasion where I appreciate javascript having dynamic typing.
 * @returns {boolean} Whether or not the values are empty.
 */
function isEmpty(...input) {
    for (const val of input){
        if (val === null || val === undefined || val.length === 0){
            return true;
        }
    }
    return false;
}

//If not for some specific issues involving time zones, these could be condensed into a single query using auto.
//Accessing a dummy db in memory would be better than opening a file, but attempts to do so failed for unknown reasons.

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
async function dateToEpoch(time){
    let base = await getDBConnection();
    let timeQuery = "SELECT unixepoch(?, 'utc')";
    let newTime = await base.get(timeQuery, [time]);
    await base.close();
    return JSON.stringify(newTime["unixepoch(?, 'utc')"]);
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
    checkLoop: while (!safe){
        for(const val of ids){
            if (val["sessionid"] === sessionId){
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

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);