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
SELECT r."id",r."number",r."max",t."type",b."label",r."count",r."rate",r."picture"
FROM "rooms" r,"types" t,"beds" b
JOIN "types" t ON t."id"=r."type"
JOIN "beds" b ON b."id"=r."bed"
WHERE ?;


--	create account
INSERT INTO "users" ("id","user","code","name","email","sessionid") VALUES
(NULL,?,?,?,?,NULL);


--	login
UPDATE "users" SET "sessionid"=? WHERE "id"=?
UPDATE "users" SET "sessionid"=? WHERE "user"=?


--	logout
UPDATE "users" SET "sessionid"=NULL WHERE "id"=?
UPDATE "users" SET "sessionid"=NULL WHERE "user"=?


--	view trans


--	all trans per user
SELECT t."id",u."user",r."number",t."confirm",date(b."date"),date(b."ckin"),date(b."ckout"),t."occupants",t."cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."id"=t."room"
WHERE u."user"=?;


--	make res
INSERT INTO "trans" ("user","room","confirm","date","ckin","ckout","occupants","cost") VALUES
(?,?,?,unixepoch(?),unixepoch(?),unixepoch(?),?,?);
