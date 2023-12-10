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
(100,2,'Economy','Twin',1,60*100,0),
(101,2,'Standard','Full',1,75*100,0),
(102,3,'Deluxe','Queen',1,110*100,0),
(103,4,'Suite','King',1,140*100,0),
(104,4,'Suite','Twin',1,140*100,0),
(105,3,'Deluxe','Full',1,110*100,0),
(106,2,'Standard','Queen',1,75*100,0),
(107,2,'Economy','King',1,60*100,0),
(108,2,'Economy','Twin',1,60*100,0),
(109,2,'Standard','Full',1,75*100,0),
(200,3,'Deluxe','Queen',1,110*100,0),
(201,4,'Suite','King',1,140*100,0),
(202,4,'Suite','Twin',1,140*100,0),
(203,3,'Deluxe','Full',1,110*100,0),
(204,2,'Standard','Queen',1,75*100,0),
(205,2,'Economy','King',1,60*100,0),
(206,2,'Economy','Twin',1,60*100,0),
(207,2,'Standard','Full',1,75*100,0),
(208,3,'Deluxe','Queen',1,110*100,0),
(209,4,'Suite','King',1,140*100,0),
(215,4,'Suite','Twin',1,140*100,0),
(217,3,'Deluxe','Full',1,110*100,0),
(237,2,'Standard','Queen',1,75*100,0),
(401,2,'Economy','King',1,60*100,0),
(411,2,'Economy','Twin',1,60*100,0),
(412,2,'Standard','Full',1,75*100,0),
(415,3,'Deluxe','Queen',1,110*100,0),
(417,4,'Suite','King',1,140*100,0),
(428,4,'Suite','Twin',1,140*100,0);
--(101,2,1,1,1,(75*100),concat('/public/assets/img/rooms/',101,'.png')),
--(217,4,3,1,4,(150*100),concat('/public/assets/img/rooms/',217,'.png'));


--	users
INSERT INTO "users" ("id","user","code","name","email","sessionid") VALUES
(0,'derrek',NULL,'Derrek Do','Derrek.Do@Seattlecolleges.edu',NULL),
(1,'chris',NULL,'Chris Nickell','Christopher.Nickell@Seattlecolleges.edu',NULL),
(2,'joel',NULL,'Joel Perry','Joel.Perry@seattlecolleges.edu',NULL),
(3,'kyle',NULL,'Kyle Potempa','Kyle.Potempa@seattlecolleges.edu',NULL);


--	info
INSERT INTO "info" ("id","phone","address","city","state","code") VALUES
(0,'8005551212','123 Nowhere Way','Nowhere','NW','10001'),
(1,'8005550100','987 Nowhere St','Nowhere','NW','10001'),
(2,'8005550123','456 Nowhere Ave','Nowhere','NW','10001'),
(3,'8005550177','753 Nowhere Rd','Nowhere','NW','10001');


--	transactions
INSERT INTO "trans" ("id","user","room","confirm","date","ckin","ckout","occupants","cost") VALUES
(0,1,217,1,unixepoch(concat_ws('-','2024','01','03')),unixepoch('2024-01-07'),unixepoch('2024-01-11'),3,(225*100)),
(1,0,101,2,unixepoch('2024-01-09'),unixepoch('2024-01-13'),unixepoch('2024-01-14'),2,(75*100));


--	Comment BEGIN TRANSACTION and this out to use with DB Browser for SQLite
COMMIT;
