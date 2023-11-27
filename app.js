/*
 *
 */
'use strict';

const express = require('express');
const { format } = require('path');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
app.use(cors());



// Start Test
app.get("/test", async (req, res) => {
    res.type("text");
    res.send(await testDB());
});

async function testDB() {
    let db = await getDBConnection();
    let qry = "SELECT * FROM rooms";
    let result =  await db.all(qry);
    let row = result[1];
    let room = "";
    room += row.roomNumber;
    await db.close();
    return room;
}
// End Test



async function getDBConnection() {
    const db = await sqlite.open({
        filename: 'overlook-hotel.db',
        driver: sqlite3.Database
    });
    return db;
}


app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);