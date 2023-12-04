/* coding:UTF-8
Team Dijon
11/26/2023

This declares the tables for the Overlook Hotel database
*/

/*
This SQL is peculiar to SQLite
Caveat emptor

Foreign key enforcement is on

All tables are (supposed to be) marked as STRICT tables to protect against "Flexible Typing"
SQLite 3.37.0 (2021-11-27) introduced the option of STRICT tables
DB Browser for SQLite 3.12.2 (2021-05-18) uses SQLite 3.35.5
To upgrade to a newer version of SQLite (3.44.2), copy the .dll to the C:\Program Files\DB Browser for SQLite folder

AUTOINCREMENT is unnecessary but could be added if desired

- email addresses do not have to be UNIQUE
- room rate is in pennies and in the range $50.00-$1,000.00
- trans cost is in pennies and in the range $50.00-$1,000,000.00
- max, (bed) count and occupants are in the range 1-4
- dates are Unix Time, seconds since 1970-01-01 00:00:00 UTC and in the range
  Jan 01 2024 00:00:00 - Jan 19 2038 03:14:08
*/



--	Turn on foreign key enforcement
PRAGMA foreign_keys=1;


--	Comment this and COMMIT out to use with DB Browser for SQLite
--BEGIN TRANSACTION;


CREATE TABLE IF NOT EXISTS "rooms" (
"id" INTEGER PRIMARY KEY,
"number" INTEGER UNIQUE CHECK (number>=10 AND number<=1000),
"max" INTEGER CHECK (max>0 AND max<5),	-- maximum occupancy 1-4
"type" INTEGER REFERENCES "types" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
"bed" INTEGER REFERENCES "beds" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
"count" INTEGER CHECK (count>0 AND count<5),	-- beds 1-4
"rate" INTEGER CHECK (rate>=5000 AND rate<=100000),	-- $50.00-$1,000.00 in pennies
"picture" BLOB
) STRICT;


CREATE TABLE IF NOT EXISTS "types" (
"id" INTEGER PRIMARY KEY,
"label" TEXT	-- Economy,Standard,Standard,Suite
) STRICT;

INSERT INTO "types" ("id","label") VALUES
(0,'Economy'),
(1,'Standard'),
(2,'Deluxe'),
(3,'Suite');


CREATE TABLE IF NOT EXISTS "beds" (
"id" INTEGER PRIMARY KEY,
"label" TEXT	-- Twin,Full,Queen,King
) STRICT;

INSERT INTO "beds" ("id","label") VALUES
(0,'Twin'),
(1,'Full'),
(2,'Queen'),
(3,'King');


CREATE TABLE IF NOT EXISTS "users" (
"id" INTEGER PRIMARY KEY,
"user" TEXT UNIQUE,	-- user name
"code" TEXT,	-- passcode
"name" TEXT,
"email" TEXT,
"sessionid" INTEGER UNIQUE
) STRICT;


CREATE TABLE IF NOT EXISTS "trans" (
"id" INTEGER PRIMARY KEY,
"user" INTEGER REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
"room" INTEGER REFERENCES "rooms" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
"date" INTEGER CHECK (date>1704067199 AND date<2147483648),
"ckin" INTEGER CHECK (ckin>1704067199 AND ckin<2147483648),
"ckout" INTEGER CHECK (ckout>1704067199 AND ckout<2147483648),
"occupants" INTEGER CHECK (occupants>0 AND occupants<5),	-- maximum occupancy 1-4
"cost" INTEGER CHECK (cost>=5000 AND cost<=100000)	-- $50.00-$1,000,000.00 in pennies
) STRICT;


--	Comment BEGIN TRANSACTION and this out to use with DB Browser for SQLite
--COMMIT;
