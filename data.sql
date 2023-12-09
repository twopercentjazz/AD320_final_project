/* coding:UTF-8
Team Dijon
11/26/2023

This defines the data for the Overlook Hotel database
*/

/*
number	10-1000
room rate	50.00-1,000.00
trans cost	50.00-1,000,000.00
max, (bed) count and occupants	1-4
dates	2023/12/31-2038/01/19
dates	1704067199-2147483648
*/



--	Turn on foreign key enforcement
PRAGMA foreign_keys=1;


--	Comment this and COMMIT out to use with DB Browser for SQLite
BEGIN TRANSACTION;


--	pictures
INSERT INTO "pictures" ("id","picture") VALUES
(0,'/public/assets/img/rooms/101.png'),
(1,'/public/assets/img/rooms/217.png');


--	rooms
INSERT INTO "rooms" ("number","max","type","bed","count","rate","picture") VALUES
(101,2,'Standard','Full',1,(75*100),0),
(217,4,'Suite','King',4,(150*100),1);
--(101,2,1,1,1,(75*100),concat('/public/assets/img/rooms/',101,'.png')),
--(217,4,3,1,4,(150*100),concat('/public/assets/img/rooms/',217,'.png'));


--	users
INSERT INTO "users" ("id","user","code","name","email","sessionid") VALUES
(0,'derrek',NULL,'Derrek Do','Derrek.Do@Seattlecolleges.edu',NULL),
(1,'chris',NULL,'Chris Nickell','Christopher.Nickell@Seattlecolleges.edu',NULL),
(2,'joel',NULL,'Joel Perry','Joel.Perry@seattlecolleges.edu',NULL),
(3,'kyle',NULL,'Kyle Potempa','Kyle.Potempa@seattlecolleges.edu',NULL);


--	transactions
INSERT INTO "trans" ("id","user","room","confirm","date","ckin","ckout","occupants","cost") VALUES
(0,1,217,1,unixepoch(concat_ws('-','2024','01','03')),unixepoch('2024-01-07'),unixepoch('2024-01-11'),3,(225*100)),
(1,0,101,2,unixepoch('2024-01-09'),unixepoch('2024-01-13'),unixepoch('2024-01-14'),2,(75*100));


--	Comment BEGIN TRANSACTION and this out to use with DB Browser for SQLite
COMMIT;
