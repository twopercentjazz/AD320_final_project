 [Team Dijon]: #
 [2023-12-12]: #
 [AD320]: #

#Overlook Hotel API

## Create a new user (basic).

**Request Format**: /create-user with POST parameters of username, password (6-30 characters), name, and email. Null values not accepted.

**Request Type**: POST

**Returned Data Format**: Plain Text

**Description**: Creates a new user. Does not add user information (address, phone number, et cetera).

**Example Request**: /create-user with POST parameters of username = 'usethisname', password = 'badpassword', name = 'Namae', and email = 'fake@email.com'

**Example Response**: User successfully created.

**Error Handling**: 400 errors for empty/null parameters. 400 error if a user already exists. 500 error for other database errors.

## Create a new user (full).

**Request Format**: /create-user-full with POST parameters of username, password (6-30 characters), name, email, phone number, address, city, state (two letter code), and area code (five digits). Null values not accepted.

**Request Type**: POST

**Returned Data Format**: Plain Text

**Description**: Creates a new user complete with user information.

**Example Request**: /create-user-full with POST parameters of username = 'usethisname', password = 'badpassword', name = 'Namae', email = 'fake@email.com', phone = '555-666-7777', address = 'Home', city =  'Nowhere', state = 'WA', and code = '12345'

**Example Response**: New user successfully created.

**Error Handling**: 400 errors for empty/null parameters. 400 error if a user already exists. 500 error for other database errors.

## Login

**Request Format**: /login with POST parameters of username and password

**Request Type**: POST

**Returned Data Format**: Plain Text

**Description**: Logs a user in.

**Example Request**: /login with POST parameters of username = 'usethisname' and password = 'badpassword'

**Example Response**: Successfully logged in.

**Error Handling**: 400 errors for empty/null parameters, user not found in the database, or if the supplied password doesn't match the database. 500 errors for database errors.

## Logout

**Request Format**: /logout

**Request Type**: POST

**Returned Data Format**: Plain Text

**Description**: Logs the user out. If a session cookie isn't found, the user is assumed to already be logged out.

**Example Request**: /logout

**Example Response**: Successfully logged out

**Error Handling**: Talk to your ISP

## Active session check

**Request Format**: /activity-check

**Request Type**: GET

**Returned Data Format**: Plain Text

**Description**: Checks if the user is currently logged in by comparing the username and sessionId, if any, against those in the database.

**Example Request**: /activity-check

**Example Response**: true

**Error Handling**: TODO

## Get User Info

**Request Format**: /user-info

**Request Type**: GET

**Returned Data Format**: JSON

**Description**: Returns account information of the currently logged in user.

**Example Request**: /user-info

**Example Response**: { id: 6, user: "usethisname", code: "badPassword", name: "Namae", email: "fake@email", sessionid: 491521106317945 }

**Error Handling**: 400 errors for empty/null cookies. 500 error for database errors.

## Get All User Info

**Request Format**: /user-all-info

**Request Type**: GET

**Returned Data Format**: JSON

**Description**: Returns all account and personal information of the currently logged in user.

**Example Request**: /user-all-info

**Example Response**: { id: 6, user: "usethisname", name: "Namae", email: "fake@email", phone: "555-666-7777", address: "Home", city: "Nowhere", state: "WA", code: "12345" }

**Error Handling**: 400 errors for empty/null cookies. 500 error for database errors.

## View Reservations

**Request Format**: /user-reservations

**Request Type**: GET

**Returned Data Format**: JSON

**Description**: Returns a list of all reservations for the currently logged in user.

**Example Request**: /user-reservations

**Example Response**: { id: 8, user: "usethisname", room: 220, confirm: 1038104376221780, reserved: "2023-12-13", ckin: "2024-03-13", ckout: "2024-03-15", occupants: 2, cost: 260 }

**Error Handling**: 400 errors for empty/null cookies. 500 error for database errors.

## Past Reservations

**Request Format**: /past-reservations

**Request Type**: GET

**Returned Data Format**: JSON

**Description**: Returns a list of all reservations for the currently logged in user.

**Example Request**: /past-reservations

**Example Response**: { id: 8, user: "usethisname", room: 220, confirm: 7622178010381043, reserved: "2022-12-13", ckin: "2023-03-13", ckout: "2023-03-15", occupants: 2, cost: 260 }

**Error Handling**: 400 errors for empty/null cookies. 500 error for database errors.

## Future Reservations

**Request Format**: /future-reservations

**Request Type**: GET

**Returned Data Format**: JSON

**Description**: Returns a list of all reservations for the currently logged in user.

**Example Request**: /future-reservations

**Example Response**: { id: 8, user: "usethisname", room: 220, confirm: 1038104376221780, reserved: "2023-12-13", ckin: "2024-03-13", ckout: "2024-03-15", occupants: 2, cost: 260 }

**Error Handling**: 400 errors for empty/null cookies. 500 error for database errors.

## Reserve a room

**Request Format**: /reserve

**Request Type**: POST

**Returned Data Format**: Plain Text

**Description**: Reserves a room

**Example Request**: /reserve with POST parameters of room = '217', checkIn = '2024-03-02', checkOut = '2024-04-01', and occupants = '2'

**Example Response**: 4376210381021780

**Error Handling**: 400 errors for empty/null cookies and parameters. 400 error the room isn't found in the database. 400 error if the query fails but doesn't throw an error, such as it is malformed. 500 error for other database errors.

## View all rooms

**Request Format**: /rooms

**Request Type**: GET

**Returned Data Format**: JSON

**Description**: Returns a list of every room (effectively, the entire rooms table with some formatting changes).

**Example Request**: /rooms

**Example Response**: Every room in a JSON

**Error Handling**: 500 error for database errors.

## Room information

**Request Format**: /room-info/:room-number

**Request Type**: GET

**Returned Data Format**: JSON

**Description**: Returns all the information on a room.

**Example Request**: /room-info/217

**Example Response**: {"number":217,"max":2,"type":"Deluxe","bed":"Queen","count":1,"rate":100,"picture":"../../assets/img/rooms/101.png"}

**Error Handling**: 500 error for database errors. Otherwise, if the room isn't found (generally because the provided room number isn't valid), text response will say as such.

## Room Filter, query based.

**Request Format**: /room-filter with query values

**Request Type**: GET

**Returned Data Format**: JSON

**Description**: Returns a filtered list of rooms that meet the given criteria. Query based. Using dates requires exactly two dates, marked as checkIn and checkOut respectively.

**Example Request**: /room-filter?bedCount=1&bedType=Queen&bedType=King

**Example Response**: { number: 105, max: 2, type: "Standard", bed: "Queen", count: 1, rate: 90, picture: "../../assets/img/rooms/101.png" }...

**Error Handling**: 400 errors for empty/null cookies and if no query parameters are found. 500 error for database errors. Values must be properly spelled, punctuated, and formated. Realistically, each field has a limited amount of possible options, though it's also possible that values could be added to the database that expand what's possible. Using dates requires exactly two dates, in ISO 8601 Date format (YYYY-MM-DD). There is an unresolved problem where dates are checked "within" but not "without". Quite frankly, the "query set" has a lot going on, and while everything worked in testing at some point, there are a lot of opportunities for small issues.

## Room Filter, parameter based

**Request Format**: /room-filter/:guests/:roomType/:bedType/:bedCount/:checkIn/:checkOut

**Request Type**: GET

**Returned Data Format**: JSON

**Description**: Returns a filtered list of rooms that meet the given criteria. Parameter based

**Example Request**: /room-filter/3/Deluxe/Queen/null/null/null

**Example Response**: { number: 207, max: 4, type: "Deluxe", bed: "Queen", count: 2, rate: 115, picture: "../../assets/img/rooms/101.png" }...

**Error Handling**: 400 errors for empty/null cookies and if no query parameters are found. 500 error for database errors. Values must be properly spelled, punctuated, and formated. Realistically, each field has a limited amount of possible options, though it's also possible that values could be added to the database that expand what's possible. Using dates requires exactly two dates, in ISO 8601 Date format (YYYY-MM-DD). There is an unresolved problem where dates are checked "within" but not "without". Quite frankly, the "query set" has a lot going on, and while everything worked in testing at some point, there are a lot of opportunities for small issues. Multiple parameters for a given field are untested. Expected behavior is *probably* failure, but the actual results depend on how javascript/node/express parse requests.

## Room Filter, JSON based.

**Request Format**: /room-filter with a JSON in the body and a header of "Content-type": "application/json"

**Request Type**: POST

**Returned Data Format**: JSON

**Description**: Returns a filtered list of rooms that meet the given criteria. JSON POST based

**Example Request**: /room-filter with a body of {"roomType": ["Economy","Deluxe"], "bedType":["Twin","Queen"], "bedCount": 1}

**Example Response**: { number: 206, max: 2, type: "Deluxe", bed: "Queen", count: 1, rate: 100, picture: "../../assets/img/rooms/101.png" }...

**Error Handling**: 400 errors for empty/null cookies and if no query parameters are found. 500 error for database errors. Values must be properly spelled, punctuated, and formated. Realistically, each field has a limited amount of possible options, though it's also possible that values could be added to the database that expand what's possible. Using dates requires exactly two dates, in ISO 8601 Date format (YYYY-MM-DD). There is an unresolved problem where dates are checked "within" but not "without". Quite frankly, the "query set" has a lot going on, and while everything worked in testing at some point, there are a lot of opportunities for small issues.

## Search

**Request Format**: /search with query values

**Request Type**: GET

**Returned Data Format**: JSON

**Description**: Returns a filtered list of rooms that meet criteria based on found keywords. Attempts to determine number of beds and guests, if such values are found. Attempts to parse dates, if a suitable value is found. Requires exactly two dates for that to have any effect.

**Example Request**: /search?input=deluxe+king+or+queen

**Example Response**: { number: 208, max: 2, type: "Deluxe", bed: "King", count: 1, rate: 110, picture: "../../assets/img/rooms/101.png" }...

**Error Handling**: 400 errors for empty/null cookies and if no query parameters are found. 500 error for database errors. Values must be properly spelled, punctuated, and formated. Realistically, each field has a limited amount of possible options, though it's also possible that values could be added to the database that expand what's possible. Using dates requires exactly two dates, in ISO 8601 Date format (YYYY-MM-DD). There is an unresolved problem where dates are checked "within" but not "without". Quite frankly, the "query set" has a lot going on, and while everything worked in testing at some point, there are a lot of opportunities for small issues.

## Find available rooms

**Request Format**: /available-rooms with queries for guests, check in date, and check out date

**Request Type**: GET

**Returned Data Format**: JSON

**Description**: Returns a list of rooms (capable of handling the supplied number of guests) where neither the supplied check in date nor check out date fall within the range of dates for existing reservations. There is an unresolved issue where it doesn't check if dates fall outside of that range.

**Example Request**: /available-rooms?guests=4&checkin=2024-02-12&checkout=2024-03-01

**Example Response**: Every room capable of handling 4 guests, minus those with conflicting reservations.

**Error Handling**: 500 error for database errors. Requires exactly one of each query value.
