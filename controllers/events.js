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
      const recentEvents = await eventsModel.getRecentEvents();

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
  const { eventID, name, eventStartDate, eventEndDate, numOfParticipants, eventStatus } = req.body;

  try {
    await eventsModel.insertEvent(eventID, name, eventStartDate, eventEndDate, numOfParticipants, eventStatus);
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
  const { eventID, name, eventStartDate, eventEndDate, numOfParticipants, eventStatus } = req.body;

  // if (eventID === null || eventID.trim() === "") {
  //   return res.status(400).send("Form Incomplete... Please try again!");
  // }
  
  // if (name === null || name.trim() === "") {
  //   return res.status(400).send("Form Incomplete... Please try again!");
  // }
  
  // if (eventStartDate === null || eventStartDate.trim() === "") {
  //   return res.status(400).send("Form Incomplete... Please try again!");
  // }
  
  // if (eventEndDate === null || eventEndDate.trim() === "") {
  //   return res.status(400).send("Form Incomplete... Please try again!");
  // }
  
  // if (numOfParticipants === null || numOfParticipants.trim() === "") {
  //   return res.status(400).send("Form Incomplete... Please try again!");
  // }
  
  // if (eventStatus === null || eventStatus.trim() === "") {
  //   return res.status(400).send("Form Incomplete... Please try again!");
  // }

  
  if (eventID === null || eventID) {
    return res.status(400).send("Form Incomplete... Please try again!");
  }
  
  if (name === null || name) {
    return res.status(400).send("Form Incomplete... Please try again!");
  }
  
  if (eventStartDate === null || eventStartDate) {
    return res.status(400).send("Form Incomplete... Please try again!");
  }
  
  if (eventEndDate === null || eventEndDate) {
    return res.status(400).send("Form Incomplete... Please try again!");
  }
  
  if (numOfParticipants === null || numOfParticipants) {
    return res.status(400).send("Form Incomplete... Please try again!");
  }
  
  if (eventStatus === null || eventStatus) {
    return res.status(400).send("Form Incomplete... Please try again!");
  }
  
  try {
    await eventsModel.updateEvent(eventID, name, eventStartDate, eventEndDate, numOfParticipants, eventStatus);
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
  console.log(req + "Request <.");

  try {
    await eventsModel.deleteEvent(eventID);

    res.status(200).send(`${eventID} Deleted Successfully!`);
  } catch (error) {
    console.error(logError("eventID"), error);
    res.status(500).send(resError("deleteEvent"));
  }
};
