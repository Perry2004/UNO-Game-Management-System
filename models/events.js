const { formatInTimeZone } = require("date-fns-tz");
const db = require("../config/db");
const { format } = require("date-fns");
const vancouverTimeZone = "America/Vancouver";

const logError = (functionName) => `OH NO! Error with ${functionName} in Controllers:`;
const resError = (functionName) => `OH NO! Internal Server Error with ${functionName} in Controllers:`;


/**
 * CREATE TABLE IF NOT EXISTS Events (
    event_id INT AUTO_INCREMENT,
    name VARCHAR(255),
    start_date DATE NOT NULL, 
    end_date DATE NOT NULL, 
    status VARCHAR(255) NOT NULL, 
    num_of_participants INT DEFAULT 0, 
    PRIMARY KEY (event_id)
); 
 */

/**
 * 
 * For fetching the pre-populated (limited to 10) tuples in the Events table.
 */
exports.getRecentEvents = async (sortBy) => {
  try {
    let sortByClause = "";
    switch (sortBy) {
      case "recent":
        sortByClause = "event_id";
        break;
      case "startDate":
        sortByClause = "start_date";
        break;
      case "endDate":
        sortByClause = "end_date";
        break;
      case "numOfParticipants":
        sortByClause = "num_of_participants";
        break;
      case "status":
        sortByClause = "status";
        break;
      default:
        sortByClause = "event_id";
    }

    const [results] = await db.promise().query(`
        SELECT 
            event_id AS eventID, 
            name AS eventName, 
            start_date AS eventStartDate, 
            end_date AS eventEndDate, 
            num_of_participants AS numOfParticipants, 
            status AS eventStatus
        FROM Events
        ORDER BY ${sortByClause} DESC 
    `);

    return results.map((element) => ({
      eventID: element.eventID,
      eventName: element.eventName,
      eventStartDate: formatInTimeZone(element.eventStartDate, vancouverTimeZone, "yyyy-MM-dd"),
      eventEndDate: formatInTimeZone(element.eventEndDate, vancouverTimeZone, "yyyy-MM-dd"),
      numOfParticipants: element.numOfParticipants,
      eventStatus: element.eventStatus,
    }));
  } catch (error) {
    console.error("Error fetching recent events: ", error.message);
    throw error; // TODO: won't this disrupt the application? check stack, if this is handled in the calling function then a-ok.
  }
};

/**
 * For insertion of a single tuple inside the Events Table.
 * 
 * ASSUMPTION(s): 
 * - the values are pre-formatted before they are passed into the function
 *          i.e. there is checking on the frontend. [the records themselves are case-sensitive].
 *          this checking refers to the attribute domains.
 *          does not apply to start and end date attributes.
 */
exports.insertEvent = async (name, eventStartDate, eventEndDate, numOfParticipants, eventStatus) => {
  // remove eventID
  // PK auto-enforced
  // no CK
  // no FK

  // to display the error inside the browser.
  error_cf = "";

  try {
    await db
      .promise()
      .query("INSERT INTO Events SET ?", {
        // event_id: eventID,
        name: name,
        start_date: eventStartDate, // format(new Date(eventStartDate), "yyyy-mm-dd"),
        end_date: eventEndDate, // format(new Date(eventEndDate), "yyyy-mm-dd"),
        num_of_participants: numOfParticipants,
        status: eventStatus // = new Date(eventStartDate) < new Date(eventEndDate) ? "Active" : "Completed"
      });
    // console.log("Event added: " + {eventID});

  } catch (error) {
    error_cf = error.message;
    // throw error // find this aversive. 

  } finally {
    // TODO: P3 
    // Reusable React component? or just a plain browser alert. Went with latter
    //alert("An error transpired: " + error_cf);
  }
}

/**
 * For alteration of a single tuple inside the Events Table.
 * 
 * // ASSUMPTION(s): 
 * - this function is only tied to the appropriate button. 
 *        this implies that a check for an event existing will be redundant.  
 */
exports.updateEvent = async (name, eventStartDate, eventEndDate, numOfParticipants, eventStatus, eventID) => {

  if (!numOfParticipants) {
    numOfParticipants = 0;
  }

  // to display the error inside the browser.
  error_cf = "";

  eventStartDate = new Date(eventStartDate);
  eventEndDate = new Date(eventEndDate);
  // to UTC
  eventStartDate = new Date(eventStartDate.getUTCFullYear(), eventStartDate.getUTCMonth(), eventStartDate.getUTCDate());
  eventEndDate = new Date(eventEndDate.getUTCFullYear(), eventEndDate.getUTCMonth(), eventEndDate.getUTCDate());

  try {
    await db
      .promise()
      .query("UPDATE Events SET name = ?, start_date = ?, end_date = ?, num_of_participants = ?, status = ? WHERE event_id = ?", [
        name,
        eventStartDate,
        eventEndDate,
        numOfParticipants,
        eventStatus, // = new Date(eventStartDate) < new Date(eventEndDate) ? "Active" : "Completed",
        eventID
      ]);
    // TODO: confirm if the backend SQL was also updated.

  } catch (error) {
    error_cf = error.message;
    // throw error // find this aversive.

  } finally {
    // TODO: P3 
    // Reusable React component? or just a plain browser alert. Went with latter
    //alert("An error transpired: " + error_cf);
  }
}

/**
 * For fetching an event's info
 */
exports.fetchEvent = async (eventID) => {
  try {
    const myQuery = `
        SELECT *
        FROM Events
        WHERE event_id = ?
        `
    const [results] = await db.promise().query(myQuery, [eventID]);

    return results[0];

  } catch (error) {
    console.error(logError("fetchEvent"), error);
    throw error;
  }

}


/**
 * For deletion of a single tuple inside the Events Table. 
 */
exports.deleteEvent = async (eventID) => {

  // to display the error inside the browser.
  error_cf = "";

  // don't need to explicitly parse eventID to an integer; you can pass it directly as part of the array, and the driver will handle the appropriate data type conversion and escaping
  try {
    await db
      .promise()
      .query("DELETE FROM Events WHERE event_id = ?", [eventID]); // parseInt() unneeded
  } catch (error) {
    // error_cf = error.message;
    console.log(error.message);
    throw error;
  }
  // } finally {
  //   alert("An error transpired: " + error_cf);
  // }

}

// --- IGNORE ---

/**
 * CREATE TABLE IF NOT EXISTS Events (
    event_id INT AUTO_INCREMENT,
    name VARCHAR(255),
    start_date DATE NOT NULL, 
    end_date DATE NOT NULL, 
    status VARCHAR(255) NOT NULL, 
    num_of_participants INT DEFAULT 0, 
    PRIMARY KEY (event_id)
); 
 */

// TODO: fix rethrowing error to run SQL query to populate with duds. Is tricky because of references. 
// TODO: are we meeting the entity relationship 7??? requirements?
// TODO: add assertions for total participation, where appropriate.
// TODO: where is the foreign key?

// TODO: check if we have to create queries based on the normalized tables or if the original tables work just fine. 

// TODO: P1 React component for the complex queries, but understand them first.
// TODO: P3 React component for displaying error message. 

// DONE for events.
// DONE TODO: check if auto increment has been activated for events.js
// DONE: TODO: check for the candidate keys as well. [check for UNIQUE inside SQL, and M2]

// TODO: 
// inside memberships line 89, throw new Error seems iffy.

exports.checkEventExistence = async (eventName) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM Events WHERE name = ?", [eventName]);
    if (results.length === 0) {
      return false;
    } else {
      return results[0].name;
    }
  } catch (error) {
    console.error(logError("checkEventExistence"), error);
    throw error;
  }
}