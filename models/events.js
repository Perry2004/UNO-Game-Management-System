const db = require("../config/db");
const { format } = require("date-fns");

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
exports.getRecentEvents = async () => {
  try {
    const [results] = await db.promise().query(`
        SELECT 
            event_id AS eventID, 
            name AS eventName, 
            start_date AS eventStartDate, 
            end_date AS eventEndDate, 
            num_of_participants AS numOfParticipants, 
            status AS eventStatus
        FROM Events
        ORDER BY event_id DESC 
        LIMIT 10;
    `);

    // TODO: check for an empty array; P3. if it is the case that it is empty, then use pre-population. Careful for integrity constraints.

    return results.map((element) => ({
      eventID: element.eventID,
      eventName: element.eventName,
      eventStartDate: format(new Date(element.eventStartDate), "yyyy-M-d"),
      eventEndDate: format(new Date(element.eventEndDate), "yyyy-M-d"),
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
exports.insertEvent = async (eventID, name, eventStartDate, eventEndDate, numOfParticipants, eventStatus) => {
  // PK auto-enforced
  // no CK
  // no FK

  // to display the error inside the browser.
  error_cf = "";

  try {
    await db
      .promise()
      .query("INSERT INTO Events SET ?", {
        event_id: eventID,
        name: name,
        start_date: format(new Date(eventStartDate), "yyyy-M-d"),
        end_date: format(new Date(eventEndDate), "yyyy-M-d"),
        num_of_participants: numOfParticipants,
        status: eventStatus
      });
    console.log("Event added: " + {eventID});

  } catch (error) {
    error_cf = error.message;
    console.log(error.message);
    // throw error // find this aversive. 

  } finally {
    // TODO: P3 
    // Reusable React component? or just a plain browser alert. Went with latter
    alert("An error transpired: " + error_cf);
  }
}

/**
 * For alteration of a single tuple inside the Events Table.
 * 
 * // ASSUMPTION(s): 
 * - this function is only tied to the appropriate button. 
 *        this implies that a check for an event existing will be redundant.  
 */
exports.updateEvent = async (eventID, name, eventStartDate, eventEndDate, numOfParticipants, eventStatus) => {
  
  // to display the error inside the browser.
  error_cf = "";

  try {
    await db
      .promise()
      .query("UPDATE Events SET name = ?, start_date = ?, end_date = ?, num_of_participants = ?, status = ? WHERE event_id = ?", [
        name,
        format(new Date(eventStartDate), "yyyy-M-d"),
        format(new Date(eventEndDate), "yyyy-M-d"),
        numOfParticipants,
        eventStatus,
        eventID
      ]);
    console.log("Event updated: " + {eventID}); // should be viewable on the browser
    // TODO: confirm if the backend SQL was also updated.

  } catch (error) {
    error_cf = error.message;
    console.log(error.message);
    // throw error // find this aversive.

  } finally {
    // TODO: P3 
    // Reusable React component? or just a plain browser alert. Went with latter
    alert("An error transpired: " + error_cf);
  }
}


/**
 * For deletion of a single tuple inside the Events Table. 
 */
exports.deleteEvent = async (eventID) => {

  // to display the error inside the browser.
  error_cf = "";

  try {
    await db
    .promise()
    .query("DELETE FROM Events WHERE event_id = ?", [eventID])
  } catch (error) {
    error_cf = error.message;
    console.log(error.message);
  } finally {
    alert("An error transpired: " + error_cf);
  }

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