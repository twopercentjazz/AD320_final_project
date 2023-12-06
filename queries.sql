/* coding:UTF-8
Team Dijon
11/26/2023

This defines the queries for the Overlook Hotel database
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


--	all rooms
SELECT r."id",r."number",r."max",t."type",b."label",r."count",r."rate",r."picture"
FROM "rooms" r,"types" t,"beds" b
WHERE t."id"=r."type" AND b."id"=r."bed";


--	filter rooms


--	create account


--	login


--	logout


--	view trans


--	all trans per user


--	make res
