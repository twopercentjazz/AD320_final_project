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
- room number is in the range 100-300
- room rate is in pennies and in the range $50.00-$200.00
- passcode("password") is in the range 6-30 characters
- trans cost is in pennies and in the range $50.00-$10,000.00
- max, (bed) count and occupants are in the range 1-4
- dates are Unix Time, seconds since 1970-01-01 00:00:00 UTC and in the range
  Jan 01 2024 00:00:00 - Jan 19 2038 03:14:08
*/

/*
*/



--	Turn on foreign key enforcement
PRAGMA foreign_keys=1;


--	Comment this and COMMIT out to use with DB Browser for SQLite
BEGIN TRANSACTION;


DROP TABLE IF EXISTS "trans";
DROP TABLE IF EXISTS "rooms";
DROP TABLE IF EXISTS "pictures";
DROP TABLE IF EXISTS "types";
DROP TABLE IF EXISTS "beds";
DROP TABLE IF EXISTS "info";
DROP TABLE IF EXISTS "users";


CREATE TABLE IF NOT EXISTS "types" (
"label" TEXT NOT NULL UNIQUE	-- Economy,Standard,Deluxe,Suite
) STRICT;
--"id" INTEGER PRIMARY KEY,

INSERT INTO "types" ("label") VALUES
('Economy'),
('Standard'),
('Deluxe'),
('Suite');
/*
INSERT INTO "types" ("id","label") VALUES
(0,'Economy'),
(1,'Standard'),
(2,'Deluxe'),
(3,'Suite');
*/


CREATE TABLE IF NOT EXISTS "beds" (
"label" TEXT NOT NULL UNIQUE	-- Twin,Full,Queen,King
) STRICT;
--"id" INTEGER PRIMARY KEY,

INSERT INTO "beds" ("label") VALUES
('Twin'),
('Full'),
('Queen'),
('King');
/*
INSERT INTO "beds" ("id","label") VALUES
(0,'Twin'),
(1,'Full'),
(2,'Queen'),
(3,'King');
*/


CREATE TABLE IF NOT EXISTS "pictures" (
"id" INTEGER PRIMARY KEY NOT NULL,
"picture" TEXT NOT NULL
) STRICT;


CREATE TABLE IF NOT EXISTS "rooms" (
"number" INTEGER PRIMARY KEY NOT NULL CHECK ("number" BETWEEN 100 AND 300),
"max" INTEGER NOT NULL CHECK ("max" BETWEEN 1 AND 4),	-- maximum occupancy
/*
The expression of a CHECK constraint may not contain a subquery
"type" TEXT NOT NULL CHECK ("type" IN (SELECT "label" FROM "types")),
"bed" TEXT NOT NULL CHECK ("bed" IN (SELECT "label" FROM "beds")),
*/
"type" TEXT NOT NULL CHECK ("type" IN ('Economy','Standard','Deluxe','Suite')),
"bed" TEXT NOT NULL CHECK ("bed" IN ('Twin','Full','Queen','King')),
"count" INTEGER NOT NULL CHECK ("count" BETWEEN 1 AND 4),	-- beds
"rate" INTEGER NOT NULL CHECK ("rate" BETWEEN 50*100 AND 200*100),	-- $50.00-$200.00 in pennies
"picture" INTEGER DEFAULT NULL REFERENCES "pictures" ON UPDATE CASCADE ON DELETE SET NULL
) STRICT;
--"id" INTEGER PRIMARY KEY,
--"type" INTEGER REFERENCES "types" ON UPDATE CASCADE ON DELETE SET NULL,
--"bed" INTEGER REFERENCES "beds" ON UPDATE CASCADE ON DELETE SET NULL,


/*
CREATE TABLE IF NOT EXISTS "users" (
"id" INTEGER PRIMARY KEY NOT NULL,
"user" TEXT NOT NULL UNIQUE,	-- user name
"pass" TEXT NOT NULL CHECK (length("code") BETWEEN 6 AND 30),	-- passcode
"name" TEXT NOT NULL,
"email" TEXT NOT NULL,
"phone" TEXT NOT NULL CHECK (length("phone") IN (10,12,14)),
"address" TEXT NOT NULL,
"city" TEXT NOT NULL,
"state" TEXT NOT NULL CHECK (length("state")=2),
"code" TEXT NOT NULL CHECK (length("code")=5 OR length("code")=10)
"sessionid" INTEGER UNIQUE DEFAULT NULL
) STRICT;
*/


CREATE TABLE IF NOT EXISTS "users" (
"id" INTEGER PRIMARY KEY NOT NULL,
"user" TEXT NOT NULL UNIQUE,	-- user name
"code" TEXT NOT NULL CHECK (length("code") BETWEEN 6 AND 30),	-- passcode
"name" TEXT NOT NULL,
"email" TEXT NOT NULL,
"sessionid" INTEGER UNIQUE DEFAULT NULL
) STRICT;


CREATE TABLE IF NOT EXISTS "info" (
"id" INTEGER PRIMARY KEY NOT NULL REFERENCES "users" ON UPDATE CASCADE ON DELETE CASCADE,
"phone" TEXT NOT NULL CHECK (length("phone") IN (10,12,14)),
"address" TEXT NOT NULL,
"city" TEXT NOT NULL,
"state" TEXT NOT NULL CHECK (length("state")=2),
"code" TEXT NOT NULL CHECK (length("code")=5 OR length("code")=10)
) STRICT;


CREATE TABLE IF NOT EXISTS "trans" (
"id" INTEGER PRIMARY KEY NOT NULL,
"user" INTEGER NOT NULL REFERENCES "users" ON UPDATE CASCADE ON DELETE CASCADE,
"room" INTEGER NOT NULL REFERENCES "rooms" ON UPDATE CASCADE ON DELETE CASCADE,
"confirm" INTEGER NOT NULL UNIQUE,
"date" INTEGER NOT NULL CHECK ("date" BETWEEN unixepoch('2023-12-01') AND unixepoch('2038-01-18')),
"ckin" INTEGER NOT NULL CHECK ("ckin" BETWEEN unixepoch('2023-12-01') AND unixepoch('2038-01-18')),
"ckout" INTEGER NOT NULL CHECK ("ckout" BETWEEN unixepoch('2023-12-01') AND unixepoch('2038-01-18')),
"occupants" INTEGER NOT NULL CHECK ("occupants" BETWEEN 1 AND 4),	-- maximum occupancy
"cost" INTEGER NOT NULL CHECK ("cost" BETWEEN 50*100 AND 10000*100)	-- $50.00-$10,000.00 in pennies
) STRICT;


--	Comment BEGIN TRANSACTION and this out to use with DB Browser for SQLite
COMMIT;
