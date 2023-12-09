/* coding:UTF-8
Team Dijon
11/26/2023

This defines the queries for the Overlook Hotel database
*/

/*
room rate	50.00-1,000.00
trans cost	50.00-1,000,000.00
max, (bed) count and occupants	1-4
dates	2023/12/31-2038/01/19
dates	1704067199-2147483648
*/



--	Turn on foreign key enforcement
PRAGMA foreign_keys=1;


--	all rooms
SELECT r."number",r."max",r."type",r."bed",r."count",CAST((r."rate"/100) AS REAL) AS "rate",p."picture"
FROM "rooms" r,"pictures" p
WHERE p."id"=r."picture";
-- ~ SELECT r."id",r."number",r."max",t."label",b."label",r."count",CAST((r."rate"/100) AS REAL) AS "rate",r."picture"
-- ~ FROM "rooms" r,"types" t,"beds" b
-- ~ WHERE t."id"=r."type" AND b."id"=r."bed";

--	all rooms without direct reference to the picture field
-- ~ SELECT r."id",r."number",r."max",t."label",b."label",r."count",CAST((r."rate"/100) AS REAL) AS "rate",concat('/public/assets/img/rooms/',r."number",'.png')
-- ~ FROM "rooms" r,"types" t,"beds" b
-- ~ WHERE t."id"=r."type" AND b."id"=r."bed";


--	filter rooms
SELECT r."number",r."max",r."type",r."bed",r."count",CAST((r."rate"/100) AS REAL) AS "rate",p."picture"
FROM "rooms" r
JOIN "pictures" p ON p."id"=r."picture"
WHERE ?;
-- ~ SELECT r."id",r."number",r."max",t."label",b."label",r."count",CAST((r."rate"/100) AS REAL) AS "rate",r."picture"
-- ~ FROM "rooms" r,"types" t,"beds" b
-- ~ JOIN "types" t ON t."id"=r."type"
-- ~ JOIN "beds" b ON b."id"=r."bed"
-- ~ WHERE ?;

--	filter rooms without direct reference to the picture field
-- ~ SELECT r."id",r."number",r."max",t."label",b."label",r."count",CAST((r."rate"/100) AS REAL) AS "rate",concat('/public/assets/img/rooms/',r."number",'.png')
-- ~ FROM "rooms" r,"types" t,"beds" b
-- ~ JOIN "types" t ON t."id"=r."type"
-- ~ JOIN "beds" b ON b."id"=r."bed"
-- ~ WHERE ?;


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
SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"=? AND t."confirm"=?;


--	all trans per user
SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."id"=t."room"
WHERE u."user"=?;


--	make res
INSERT INTO "trans" ("user","room","confirm","date","ckin","ckout","occupants","cost") VALUES
(?,?,?,unixepoch(?),unixepoch(?),unixepoch(?),?,(?*100));
