const db = require("../config/db");
const { format } = require("date-fns");
const { toZonedTime, formatInTimeZone } = require("date-fns-tz");

const vancouverTimeZone = "America/Vancouver";

const logError = (functionName) =>
  `OH NO! Error with ${functionName} in Events Models:`;

/**
 * CREATE TABLE IF NOT EXISTS Events (
    event_id INT AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    start_date DATE NOT NULL, 
    end_date DATE NOT NULL, 
    status VARCHAR(255) NOT NULL, 
    num_of_participants INT DEFAULT 0, 
    PRIMARY KEY (event_id)
);  
*/

exports.getRecentEvents = async (order) => {
  let orderByClause;

  switch (order) {
    case "recent":
      orderByClause = "e.event_id DESC";
      break;
    case "startDate":
      orderByClause = "e.start_date, e.status, e.event_id DESC";
      break;
    case "endDate":
      orderByClause = "e.end_date DESC, e.status, e.event_id DESC";
      break;
    case "numOfParticipants":
      orderByClause = "e.num_of_participants DESC";
      break;
    case "status":
      orderByClause = `
                CASE 
                    WHEN e.status = 'Upcoming' THEN 1
                    WHEN e.status = 'Active' THEN 2
                    WHEN e.status = 'Completed' THEN 3
                END,
                e.event_id DESC
            `;
      break;
    default:
      orderByClause = "e.event_id DESC";
  }

  try {
    await updateEventStatus();

    const [results] = await db.promise().query(`
            SELECT 
                e.event_id AS eventID, 
                e.name AS eventName, 
                e.start_date AS eventStartDate, 
                e.end_date AS eventEndDate, 
                e.num_of_participants AS numOfParticipants, 
                e.status AS eventStatus
            FROM Events e
            ORDER BY ${orderByClause} 
        `);

    return results.map((element) => ({
      eventID: element.eventID,
      eventName: element.eventName,
      eventStartDate: format(new Date(element.eventStartDate), "yyyy-MM-dd"),
      eventEndDate: format(new Date(element.eventEndDate), "yyyy-MM-dd"),
      numOfParticipants: element.numOfParticipants,
      eventStatus: element.eventStatus,
    }));
  } catch (error) {
    console.error(logError("getRecentEvents"), error);
    throw error;
  }
};

exports.getEventDataByID = async (eventID) => {
  try {
    const myQuery = `
            SELECT 
            	e.event_id AS eventID,
				e.name AS eventName,
				e.start_date AS eventStartDate,
                e.end_date AS eventEndDate,
				e.num_of_participants AS eventNumOfParticipants, 
				e.status AS eventStatus
            FROM Events e
            WHERE event_id = ?
		`;

    const [results] = await db.promise().query(myQuery, [eventID]);
    results[0].eventStartDate = format(
      new Date(results[0].eventStartDate),
      "yyyy-MM-dd"
    );
    results[0].eventEndDate = format(
      new Date(results[0].eventEndDate),
      "yyyy-MM-dd"
    );

    return results[0];
  } catch (error) {
    console.error(logError("getEventDataByID"), error);
    throw error;
  }
};

exports.selectEvents = async (nameS, statusS, bothS) => {
  try {
    let myQuery = ``;
    // console.log(nameS)

    if (statusS != "n/a" && nameS === "") {
      myQuery = `
            SELECT *
            FROM Events e
            WHERE status = '${statusS}'
		`;
    }

    if (bothS == "on" && statusS != "n/a" && nameS != "") {
      // check both using AND
      myQuery = `
            SELECT *
            FROM Events e
            WHERE name LIKE '%${nameS}%' 
    		AND status = '${statusS}'
		`;
    } else if (statusS != "n/a" && nameS != "") {
      // check both using OR [both not passed]
      myQuery = `
            SELECT *
            FROM Events e
            WHERE name LIKE '%${nameS}%' 
    		OR status = '${statusS}'
		`;
    } else if (statusS != "n/a" && nameS == "") {
      // Will check for just the status.
      myQuery = `
            SELECT *
            FROM Events e
            WHERE status = '${statusS}'
		`;
    } else if (nameS != "" && statusS == "n/a") {
      // logically only the name is left.
      myQuery = `
			SELECT *
			FROM Events e
			WHERE name LIKE '%${nameS}%'
			`;
    }

    const results = await db.promise().query(myQuery, [nameS, statusS]);

    return results[0];
  } catch (error) {
    console.error(logError("getEventDataByID"), error);
    throw error;
  }
};

exports.projectEvents = async ({
  name,
  start_date,
  end_date,
  num_of_participants,
  status,
}) => {
  try {
    const selectedFields = [];

    if (name === "on") selectedFields.push("name");
    if (start_date === "on") selectedFields.push("start_date");
    if (end_date === "on") selectedFields.push("end_date");
    if (status === "on") selectedFields.push("status");
    if (num_of_participants === "on")
      selectedFields.push("num_of_participants");

    if (selectedFields.length === 0) {
      selectedFields.push("name");
    }

    const fieldsToSelect = selectedFields.join(", ");

    const myQuery = `
            SELECT ${fieldsToSelect}
            FROM Events e
        `;

    const results = await db.promise().query(myQuery);
    return results[0];
  } catch (error) {
    console.error(logError("projectEvents"), error);
    throw error;
  }
};

exports.isEventNameAvailable = async (eventName) => {
  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM Events WHERE name = ?", [eventName]);

    return results.length === 0;
  } catch (error) {
    console.error(logError("isEventNameAvailable"), error);
    throw error;
  }
};

exports.updateEventByID = async (eventID, updates) => {
  try {
    const newUpdates = updates;

    if (updates.start_date || updates.end_date) {
      const todayUTC = new Date();
      const startDateUTC = toZonedTime(
        `${updates.start_date}T00:00:00`,
        vancouverTimeZone
      );
      const endDateUTC = toZonedTime(
        `${updates.end_date}T00:00:00`,
        vancouverTimeZone
      );

      let currentStatus;

      if (todayUTC < startDateUTC) {
        currentStatus = "Upcoming";
      } else if (endDateUTC < todayUTC) {
        currentStatus = "Completed";
      } else {
        currentStatus = "Active";
      }
      newUpdates.status = currentStatus;

      const startDateVancouver = formatInTimeZone(
        startDateUTC,
        vancouverTimeZone,
        "yyyy-MM-dd"
      );
      newUpdates.start_date = startDateVancouver;

      const endDateVancouver = formatInTimeZone(
        endDateUTC,
        vancouverTimeZone,
        "yyyy-MM-dd"
      );
      newUpdates.end_date = endDateVancouver;
    }

    const columnNames = Object.keys(newUpdates);
    const columnValues = Object.values(newUpdates);

    const setClause = columnNames.map((element) => `${element} = ?`).join(", ");

    if (setClause) {
      const myQuery = `UPDATE Events SET ${setClause} WHERE event_id = ?`;
      columnValues.push(eventID);

      await db.promise().query(myQuery, columnValues);
      console.log("OH YES! Events Updated Successfully!");
    }
  } catch (error) {
    console.error(logError("updateEventByID"), error);
    throw error;
  }
};

exports.registerEventByID = async (name, startDate, endDate) => {
  try {
    const todayUTC = new Date();
    const startDateUTC = toZonedTime(
      `${startDate}T00:00:00`,
      vancouverTimeZone
    );
    const endDateUTC = toZonedTime(`${endDate}T00:00:00`, vancouverTimeZone);

    let currentStatus;

    if (todayUTC < startDateUTC) {
      currentStatus = "Upcoming";
    } else if (endDateUTC < todayUTC) {
      currentStatus = "Completed";
    } else {
      currentStatus = "Active";
    }

    await db.promise().query("INSERT INTO Events SET ?", {
      name: name,
      start_date: formatInTimeZone(
        new Date(startDateUTC),
        vancouverTimeZone,
        "yyyy-MM-dd"
      ),
      end_date: formatInTimeZone(
        new Date(endDateUTC),
        vancouverTimeZone,
        "yyyy-MM-dd"
      ),
      status: currentStatus,
    });

    console.log("OH YES! Event Registered Successfully!");
  } catch (error) {
    console.error(logError("registerEventByID"), error);
    throw error;
  }
};

exports.deleteEventByID = async (eventID) => {
  try {
    await db
      .promise()
      .query("DELETE FROM Events WHERE event_id = ?", [eventID]);

    console.log("OH YES! Event Deleted Successfully!");
  } catch (error) {
    console.error(logError("deleteEventByID"), error);
    throw error;
  }
};

async function updateEventStatus() {
  try {
    const [results] = await db.promise().query("SELECT * FROM Events");

    results.forEach(async (element) => {
      const todayUTC = new Date();
      const startDateUTC = element.start_date;
      const endDateUTC = element.end_date;

      let currentStatus;

      if (todayUTC < startDateUTC) {
        currentStatus = "Upcoming";
      } else if (endDateUTC < todayUTC) {
        currentStatus = "Completed";
      } else {
        currentStatus = "Active";
      }

      await db
        .promise()
        .query("UPDATE Events SET status = ? WHERE event_id = ?", [
          currentStatus,
          element.event_id,
        ]);
    });
  } catch (error) {
    console.error(logError("updateEventStatus"), error);
    throw error;
  }
}

exports.dropAllEvents = async () => {
  try {
    await db.promise().query(`DROP TABLE IF EXISTS PlayerParticipateEvents`);
    await db.promise().query("DROP TABLE IF EXISTS Events");

    // recreate the table
    await db.promise().query(`
        CREATE TABLE
    IF NOT EXISTS Events (
        event_id INT AUTO_INCREMENT,
        name VARCHAR(255) UNIQUE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(255) NOT NULL,
        num_of_participants INT DEFAULT 0,
        PRIMARY KEY (event_id)
    );
      `);

    await db.promise().query(`
      CREATE TABLE
    IF NOT EXISTS PlayerParticipateEvents (
        player_id INT NOT NULL,
        event_id INT NOT NULL,
        PRIMARY KEY (player_id, event_id),
        FOREIGN KEY (player_id) REFERENCES Players (player_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (event_id) REFERENCES Events (event_id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    `);

    console.log("OH YES! All Events Dropped Successfully!");
  } catch (error) {
    console.error(logError("dropAllEvents"), error);
    throw error;
  }
};
