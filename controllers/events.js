const eventsModel = require("../models/events");

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

exports.loadEvents = async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const { order: sortBy } = req.query;
      const recentEvents = await eventsModel.getRecentEvents(sortBy);

      res.render("events", { recentEvents });
    } catch (error) {
      console.error("OH NO! Error Loading Events:", error);
      res.status(500).send("OH NO! Internal Server Error with Loading Events");
    }
  } else {
    res.redirect("/login");
  }
};

/**
 * Insert an Event.
 */
exports.insertEvent = async (req, res) => {
  // const { name, eventStartDate, eventEndDate, numOfParticipants, eventStatus } = req.body;
  const { eventNameC, cStartDate, cEndDate , cNumberOfParticipants, cEventStatus } = req.body;
  // removed eventID
  console.log(Object.keys(req)); //.body
  console.log(req.body);
  // console.log(req.eventNameC); // invalid

  try {
    await eventsModel.insertEvent(eventNameC, cStartDate, cEndDate , cNumberOfParticipants, cEventStatus);
    res.redirect("/events"); // redirection
  } catch (error) {
    console.error(logError("insertEvent"), error);
    res.status(500).send(resError("insertEvent"));
  }
};


/**
 * Fetch an Event('s info).
 */
exports.fetchEvent = async (req, res) => {
  const { eventID } = req.query; // TODO: confirm.
  console.log(req.query);
  console.log(eventID);

  try {
    const results = await eventsModel.fetchEvent(eventID);
    res.status(200).json(results);
  } catch (error) {
    console.error(logError("fetchEvent"), error);
    res.status(500).send(resError("fetchEvent"));
  }
};


/**
 * Update an Event.
 */
exports.updateEvent = async (req, res) => {
  const { eventNameUpdate: name, updateStartDate: eventStartDate, updateEndDate: eventEndDate, updateNumberOfParticipants: numOfParticipants, updateEventStatus: eventStatus, eventID} = req.body;

  try {
    await eventsModel.updateEvent(name, eventStartDate, eventEndDate, numOfParticipants, eventStatus, eventID);
    return res.redirect("/events");
  } catch (error) {
    console.error("Error Updating Event:", error);
    return res.redirect("/events");
  }
};


/**
 * Delete an Event.
 */
exports.deleteEvent = async (req, res) => {

  const { item: eventID } = req.body;
  // const eventID = req.body;
  console.log(req.body + "Request <.");

  try {
    await eventsModel.deleteEvent(eventID);

    res.status(200).send(`${eventID} Deleted Successfully!`);
  } catch (error) {
    console.error(logError("eventID"), error);
    res.status(500).send(resError("deleteEvent"));
  }
};

exports.checkEventExistence = async (req, res) => {
  const { eventName } = req.query;

  try {
    const results = await eventsModel.checkEventExistence(eventName);
    if (results) {
      res.status(200).send("Event Exists!");
    } else {
      res.status(409).send("Event Doesn't Exist!");
    }
  } catch (error) {
    console.error(logError("checkEventExistence"), error);
    res.status(500).send(resError("checkEventExistence"));
  }
}