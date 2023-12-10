/* coding:UTF-8
Team Dijon
11/26/2023

This defines the data for the Overlook Hotel database
*/

/*
room number	100-300
room rate	$50.00-$200.00
passcode	6-30 characters
trans cost	$50.00-$10,000.00
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
(100,1,'Economy','Twin',1,60*100,0),
(101,2,'Economy','Twin',2,75*100,0),
(102,2,'Economy','Full',1,70*100,0),
(103,2,'Standard','Full',1,80*100,0),
(104,4,'Standard','Full',2,95*100,0),
(105,2,'Standard','Queen',1,90*100,0),
(106,2,'Deluxe','Queen',1,100*100,0),
(107,4,'Deluxe','Queen',2,115*100,0),
(108,2,'Deluxe','King',1,110*100,0),
(109,2,'Suite','King',1,130*100,0),
(110,4,'Suite','King',2,145*100,0),
(200,1,'Economy','Twin',1,60*100,0),
(201,2,'Economy','Twin',2,75*100,0),
(202,2,'Economy','Full',1,70*100,0),
(203,2,'Standard','Full',1,80*100,0),
(204,4,'Standard','Full',2,95*100,0),
(205,2,'Standard','Queen',1,90*100,0),
(206,2,'Deluxe','Queen',1,100*100,0),
(207,4,'Deluxe','Queen',2,115*100,0),
(208,2,'Deluxe','King',1,110*100,0),
(209,2,'Suite','King',1,130*100,0),
(210,4,'Suite','King',2,145*100,0),
(211,1,'Economy','Twin',1,60*100,0),
(212,2,'Economy','Twin',2,75*100,0),
(213,2,'Economy','Full',1,70*100,0),
(214,2,'Standard','Full',1,80*100,0),
(215,4,'Standard','Full',2,95*100,0),
(216,2,'Standard','Queen',1,90*100,0),
(217,2,'Deluxe','Queen',1,100*100,0),
(218,4,'Deluxe','Queen',2,115*100,0),
(219,2,'Deluxe','King',1,110*100,0),
(220,2,'Suite','King',1,130*100,0),
(221,4,'Suite','King',2,145*100,0);


--	users
INSERT INTO "users" ("id","user","code","name","email","sessionid") VALUES
(0,'derrek','qwerty','Derrek Do','Derrek.Do@Seattlecolleges.edu',NULL),
(1,'chris','poiuyt','Chris Nickell','Christopher.Nickell@Seattlecolleges.edu',NULL),
(2,'joel','asdfgh','Joel Perry','Joel.Perry@seattlecolleges.edu',NULL),
(3,'kyle','lkjhgf','Kyle Potempa','Kyle.Potempa@seattlecolleges.edu',NULL);


--	info
INSERT INTO "info" ("id","phone","address","city","state","code") VALUES
(0,'(800) 555-1212','123 Nowhere Way','Nowhere','NW','10001'),
(1,'(800) 555-0100','987 Nowhere St','Nowhere','NW','10001'),
(2,'(800) 555-0123','456 Nowhere Ave','Nowhere','NW','10001'),
(3,'(800) 555-0177','753 Nowhere Rd','Nowhere','NW','10001');


--	transactions
INSERT INTO "trans" ("id","user","room","confirm","date","ckin","ckout","occupants","cost") VALUES
(0,1,217,1,unixepoch(concat_ws('-','2024','01','03')),unixepoch('2024-01-07'),unixepoch('2024-01-11'),3,(225*100)),
(1,0,101,2,unixepoch('2024-01-09'),unixepoch('2024-01-13'),unixepoch('2024-01-14'),2,(75*100));


--	Comment BEGIN TRANSACTION and this out to use with DB Browser for SQLite
COMMIT;
