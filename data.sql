/* coding:UTF-8
Team Dijon
11/26/2023

This defines the data for the Overlook Hotel database
*/

/*
number	10-1000
room rate	5000-100000
trans cost	5000-100000000
max, (bed) count and occupants	1-4
dates	1704067199-2147483648
*/



--	Turn on foreign key enforcement
PRAGMA foreign_keys=1;


--	Comment this and COMMIT out to use with DB Browser for SQLite
BEGIN TRANSACTION;


INSERT INTO "rooms" ("id","number","max","type","bed","count","rate","picture") VALUES
(0,101,2,1,1,1,7500,NULL),
(1,217,4,3,1,2,15000,NULL);


INSERT INTO "users" ("id","user","code","name","email","sessionid") VALUES
(0,'derrek',NULL,'Derrek Do','Derrek.Do@Seattlecolleges.edu',NULL),
(1,'chris',NULL,'Chris Nickell','Christopher.Nickell@Seattlecolleges.edu',NULL),
(2,'joel',NULL,'Joel Perry','Joel.Perry@seattlecolleges.edu',NULL),
(3,'kyle',NULL,'Kyle Potempa','Kyle.Potempa@seattlecolleges.edu',NULL);


--	Comment BEGIN TRANSACTION and this out to use with DB Browser for SQLite
COMMIT;
