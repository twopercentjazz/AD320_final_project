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
	Chris' list 1.
*/
SELECT r."number",r."max",r."type",r."bed",r."count",CAST((r."rate"/100) AS REAL) AS "rate",p."picture"
FROM "rooms" r,"pictures" p
WHERE p."id"=r."picture";


/*
	all available rooms
	Chris' list 2.

SELECT r."number",r."max",r."type",r."bed",r."count",CAST((r."rate"/100) AS REAL) AS "rate",p."picture"
FROM "rooms" r
JOIN "pictures" p ON p."id"=r."picture"
WHERE 2<=r."max"
AND (r."number" NOT IN (
	SELECT t."room"
	FROM "trans" t
	WHERE unixepoch('2024-01-09') BETWEEN t."ckin" AND (t."ckout"-86400))
)
AND (r."number" NOT IN (
	SELECT t."room"
	FROM "trans" t
	WHERE (unixepoch('2024-01-13')-86400) BETWEEN t."ckin" AND (t."ckout"-86400))
);
*/
SELECT r."number",r."max",r."type",r."bed",r."count",CAST((r."rate"/100) AS REAL) AS "rate",p."picture"
FROM "rooms" r
JOIN "pictures" p ON p."id"=r."picture"
WHERE ?<=r."max"
AND (r."number" NOT IN (
	SELECT t."room"
	FROM "trans" t
	WHERE unixepoch(?) BETWEEN t."ckin" AND (t."ckout"-86400))
)
AND (r."number" NOT IN (
	SELECT t."room"
	FROM "trans" t
	WHERE (unixepoch(?)-86400) BETWEEN t."ckin" AND (t."ckout"-86400))
);


/*
	single room
	Chris' list 3.
*/
SELECT r."number",r."max",r."type",r."bed",r."count",CAST((r."rate"/100) AS REAL) AS "rate",p."picture"
FROM "rooms" r
JOIN "pictures" p ON p."id"=r."picture"
WHERE ?=r."number";


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
	user sessionid by id
	user sessionid by name
	Chris' list 5. First Endpoint
*/
SELECT u."sessionid" FROM "users" u WHERE "id"=?;
SELECT u."sessionid" FROM "users" u WHERE "user"=?;


/*
	user by id
	user by name
	Chris' list 5. Second Endpoint
*/
SELECT u."id",u."user",u."name",u."email" FROM "users" u WHERE "id"=?;
SELECT u."id",u."user",u."name",u."email" FROM "users" u WHERE "user"=?;


/*
	all users and info
	Derrek
*/
SELECT u."id",u."user",u."name",u."email",i."phone",i."address",i."city",i."state",i."code"
FROM "users" u,"info" i
WHERE i."id"=u."id";





/*
	make reservation
	Chris' list 5. Fourth Endpoint
*/
INSERT INTO "trans" ("user","room","confirm","date","ckin","ckout","occupants","cost") VALUES
(?,?,?,unixepoch(?),unixepoch(?),unixepoch(?),?,(?*100));



/*
	all transactions per user (with 8601 dates)
	all transactions per user (with mm/dd/YYYY dates)
*/
SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"=?;


SELECT t."id",u."user",r."number" AS "room",t."confirm",strftime('%m/%d/%Y',t."date",'unixepoch') AS "reserved",strftime('%m/%d/%Y',t."ckin",'unixepoch') AS "ckin",strftime('%m/%d/%Y',t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"=?;



/*
	all transactions per user with date overlap (with 8601 dates)
	Chris' list 5. Third Endpoint

SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"='kyle' AND ((unixepoch('2024-01-01') BETWEEN t."ckin" AND (t."ckout"-86400)) OR (unixepoch('2024-01-03')-86400 BETWEEN t."ckin" AND (t."ckout"-86400)));

SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"='kyle' AND ((unixepoch('2024-01-03') BETWEEN t."ckin" AND (t."ckout"-86400)) OR (unixepoch('2024-01-08')-86400 BETWEEN t."ckin" AND (t."ckout"-86400)));

SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"='kyle' AND ((unixepoch('2024-01-08') BETWEEN t."ckin" AND (t."ckout"-86400)) OR (unixepoch('2024-01-11')-86400 BETWEEN t."ckin" AND (t."ckout"-86400)));

SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"='kyle' AND ((unixepoch('2024-01-11') BETWEEN t."ckin" AND (t."ckout"-86400)) OR (unixepoch('2024-01-19')-86400 BETWEEN t."ckin" AND (t."ckout"-86400)));

SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"='kyle' AND ((unixepoch('2024-01-19') BETWEEN t."ckin" AND (t."ckout"-86400)) OR (unixepoch('2024-01-23')-86400 BETWEEN t."ckin" AND (t."ckout"-86400)));
*/
SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"=? AND ((unixepoch(?) BETWEEN t."ckin" AND (t."ckout"-86400)) OR (unixepoch(?)-86400 BETWEEN t."ckin" AND (t."ckout"-86400)));



/*
	all transactions per user and current (with 8601 dates)
	Derrek
*/
SELECT t."id",u."user",r."number" AS "room",t."confirm",date(t."date",'unixepoch') AS "reserved",date(t."ckin",'unixepoch') AS "ckin",date(t."ckout",'unixepoch') AS "ckout",t."occupants",CAST((t."cost"/100) AS REAL) AS "cost"
FROM "trans" t
JOIN "users" u ON u."id"=t."user"
JOIN "rooms" r ON r."number"=t."room"
WHERE u."user"=? AND unixepoch('now')<t."date";



/*
	all transactions per user and past (with 8601 dates)
	Derrek
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
