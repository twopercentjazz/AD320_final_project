/* coding:UTF-8
Team Dijon
11/26/2023

This defines the queries for the Overlook Hotel database
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



/*
	all rooms
*/
SELECT r."number",r."max",r."type",r."bed",r."count",CAST((r."rate"/100) AS REAL) AS "rate",p."picture"
FROM "rooms" r,"pictures" p
WHERE p."id"=r."picture";


/*
	all available rooms

'2024-01-09'
'2024-01-13'
2
*/
SELECT r."number",r."max",r."type",r."bed",r."count",CAST((r."rate"/100) AS REAL) AS "rate",p."picture"
FROM "rooms" r
JOIN "pictures" p ON p."id"=r."picture"
WHERE (r."number" NOT IN (
	SELECT t."room"
	FROM "trans" t
	WHERE unixepoch(?) BETWEEN t."ckin" AND (t."ckout"-86400))
) AND (r."number" NOT IN (
	SELECT t."room"
	FROM "trans" t
	WHERE (unixepoch(?)-86400) BETWEEN t."ckin" AND (t."ckout"-86400))
) AND ?<=r."max";


/*
	filter rooms with the WHERE clause condition expression
*/
SELECT r."number",r."max",r."type",r."bed",r."count",CAST((r."rate"/100) AS REAL) AS "rate",p."picture"
FROM "rooms" r
JOIN "pictures" p ON p."id"=r."picture"
WHERE ?;





/*
	create user account
*/
INSERT INTO "users" ("id","user","code","name","email","sessionid") VALUES
(NULL,?,?,?,?,NULL);


/*
	get user id - use this to set the user info (below) for a newly created user (above)
*/
SELECT u."id"
FROM "users" r
WHERE u."user"=?;


/*
	create user info
*/
INSERT INTO "users" ("id","phone","address","city","state","code") VALUES
(?,?,?,?,?,?);


/*
	login user by id
	login user by name
*/
UPDATE "users" SET "sessionid"=? WHERE "id"=?
UPDATE "users" SET "sessionid"=? WHERE "user"=?


/*
	logout user by id
	logout user by name
*/
UPDATE "users" SET "sessionid"=NULL WHERE "id"=?
UPDATE "users" SET "sessionid"=NULL WHERE "user"=?






/*
	all transactions per user (with 8601 dates)
	all transactions per user (with mm/dd/YYYY dates)
*/
SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."id"=t."room"
WHERE u."user"=?;


SELECT t."id",u."user",r."number" AS "room",t."confirm",strftime('%m/%d/%Y',t."date",'unixepoch') AS "reserved",strftime('%m/%d/%Y',t."ckin",'unixepoch') AS "ckin",strftime('%m/%d/%Y',t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."id"=t."room"
WHERE u."user"=?;



/*
	all transactions per user and current (with 8601 dates)
*/
SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"=? AND unixepoch('now')<t."date";



/*
	all transactions per user and past (with 8601 dates)
*/
SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"=? AND t."ckout"<unixepoch('now');



/*
	all transactions per user and confirmation code (with 8601 dates)
	all transactions per user and confirmation code (with mm/dd/YYYY dates)
*/
SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"=? AND t."confirm"=?;


SELECT t."id",u."user",r."number" AS "room",t."confirm",strftime('%m/%d/%Y',t."date",'unixepoch') AS "reserved",strftime('%m/%d/%Y',t."ckin",'unixepoch') AS "ckin",strftime('%m/%d/%Y',t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"=? AND t."confirm"=?;



/*
	make reservation
*/
INSERT INTO "trans" ("user","room","confirm","date","ckin","ckout","occupants","cost") VALUES
(?,?,?,unixepoch(?),unixepoch(?),unixepoch(?),?,(?*100));
