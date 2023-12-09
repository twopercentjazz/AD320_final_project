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
"number" INTEGER PRIMARY KEY NOT NULL CHECK (number>=10 AND number<=1000),
"max" INTEGER NOT NULL CHECK (max>0 AND max<5),	-- maximum occupancy 1-4
/*
The expression of a CHECK constraint may not contain a subquery
"type" TEXT NOT NULL CHECK ("type" IN (SELECT "label" FROM "types")),
"bed" TEXT NOT NULL CHECK ("bed" IN (SELECT "label" FROM "beds")),
*/
"type" TEXT NOT NULL CHECK ("type" IN ('Economy','Standard','Deluxe','Suite')),
"bed" TEXT NOT NULL CHECK ("bed" IN ('Twin','Full','Queen','King')),
"count" INTEGER NOT NULL CHECK (count>0 AND count<5),	-- beds 1-4
"rate" INTEGER NOT NULL CHECK (rate>=(10*100) AND rate<=(1000*100)),	-- $10.00-$1,000.00 in pennies
"picture" INTEGER DEFAULT NULL REFERENCES "pictures" ON UPDATE CASCADE ON DELETE SET NULL
) STRICT;

--"id" INTEGER PRIMARY KEY,
--"type" INTEGER REFERENCES "types" ON UPDATE CASCADE ON DELETE SET NULL,
--"bed" INTEGER REFERENCES "beds" ON UPDATE CASCADE ON DELETE SET NULL,


CREATE TABLE IF NOT EXISTS "users" (
"id" INTEGER PRIMARY KEY NOT NULL,
"user" TEXT NOT NULL UNIQUE,	-- user name
"code" TEXT DEFAULT NULL,	-- passcode
"name" TEXT NOT NULL,
"email" TEXT NOT NULL,
"sessionid" INTEGER UNIQUE DEFAULT NULL
) STRICT;


CREATE TABLE IF NOT EXISTS "trans" (
"id" INTEGER PRIMARY KEY NOT NULL,
"user" INTEGER NOT NULL REFERENCES "users" ON UPDATE CASCADE ON DELETE CASCADE,
"room" INTEGER NOT NULL REFERENCES "rooms" ON UPDATE CASCADE ON DELETE CASCADE,
"confirm" INTEGER NOT NULL UNIQUE,
"date" INTEGER NOT NULL CHECK (date>unixepoch('2023-12-31') AND date<unixepoch('2038-01-19')),
"ckin" INTEGER NOT NULL CHECK (ckin>unixepoch('2023-12-31') AND ckin<unixepoch('2038-01-19')),
"ckout" INTEGER NOT NULL CHECK (ckout>unixepoch('2023-12-31') AND ckout<unixepoch('2038-01-19')),
"occupants" INTEGER NOT NULL CHECK (occupants>0 AND occupants<5),	-- maximum occupancy 1-4
"cost" INTEGER NOT NULL CHECK (cost>=(10*100) AND cost<=(1000000*100))	-- $10.00-$1,000,000.00 in pennies
) STRICT;


--	Comment BEGIN TRANSACTION and this out to use with DB Browser for SQLite
COMMIT;
