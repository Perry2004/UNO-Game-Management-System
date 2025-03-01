const eventsModel = require("../models/events");

const logError = (functionName) =>
  `OH NO! Error with ${functionName} in Events Controllers:`;
const resError = (functionName) =>
  `OH NO! Internal Server Error with ${functionName} in Events Controllers:`;

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

exports.loadEvents = async (req, res) => {
  if (!req.loginStatus) {
    return res.redirect("/login");
  }

  const { order } = req.query;

  try {
    const recentEvents = await eventsModel.getRecentEvents(order);

    res.render("events", { recentEvents });
  } catch (error) {
    console.error(logError("loadEvents"), error);
    res.status(500).send(resError("loadEvents"));
  }
};

exports.fetchEventData = async (req, res) => {
  const { eventID } = req.query;

  try {
    const results = await eventsModel.getEventDataByID(eventID);

    res.status(200).json(results);
  } catch (error) {
    console.error(logError("fetchEventData"), error);
    res.status(500).send(resError("fetchEventData"));
  }
};

exports.projectEvent = async (req, res) => {
  const {
    projectName,
    projectStart,
    projectEnd,
    projectNoParticipants,
    projectStatus,
  } = req.query;
  let name = projectName;
  let start_date = projectStart;
  let end_date = projectEnd;
  let status = projectStatus;
  let num_of_participants = projectNoParticipants;

  let selectedFields = [];
  if (name === "on") selectedFields.push("name");
  if (start_date === "on") selectedFields.push("start_date");
  if (end_date === "on") selectedFields.push("end_date");
  if (status === "on") selectedFields.push("status");
  if (num_of_participants === "on") selectedFields.push("num_of_participants");

  if (selectedFields.length === 0) {
    selectedFields.push("name");
  }

  try {
    const results = await eventsModel.projectEvents({
      name,
      start_date,
      end_date,
      num_of_participants,
      status,
    });
    // res.status(200).json(results); // This redirects me to a page.
    res.render("events/project", { results, selectedFields }); // render a page.
    // that was a page
  } catch (error) {
    console.error(logError("fetchEventData"), error);
    res.status(500).send(resError("fetchEventData"));
  }
};

exports.selectEvent = async (req, res) => {
  const { selectname, selector, selection } = req.query;
  let name = selectname;
  let status = selector;
  let both = selection;

  selectedFields = [
    "name",
    "start_date",
    "end_date",
    "status",
    "num_of_participants",
  ];

  try {
    const results = await eventsModel.selectEvents(name, status, both);
    res.render("events/select", { results, selectedFields }); // render a page.
  } catch (error) {
    console.error(logError("fetchEventData"), error);
    res.status(500).send(resError("fetchEventData"));
  }
};
// in order to actually access the elements insde the URL use their NAMES.

exports.checkFormInput = async (req, res) => {
  const { eventName } = req.query;

  try {
    const eventNameAvailable = await eventsModel.isEventNameAvailable(
      eventName
    );

    if (!eventNameAvailable) {
      return res.status(409).send("OH NO! Event Name already taken!");
    }

    return res.status(200).send("OH YES! No Errors in Form Input!");
  } catch (error) {
    console.error(logError("checkFormInput"), error);
    res.status(500).send(resError("checkFormInput"));
  }
};

exports.updateEvent = async (req, res) => {
  const { eventID, name, startDate, endDate } = req.body;

  try {
    const results = await eventsModel.getEventDataByID(eventID);
    const updates = {};

    if (name !== results.eventName) {
      updates.name = name;
    }

    if (
      startDate !== results.eventStartDate ||
      endDate !== results.eventEndDate
    ) {
      updates.start_date = startDate;
      updates.end_date = endDate;
    }

    if (Object.keys(updates).length > 0) {
      await eventsModel.updateEventByID(eventID, updates);
    }

    res.redirect("/events");
  } catch (error) {
    console.error(logError("updateEvent"), error);
    res.status(500).send(resError("updateEvent"));
  }
};

exports.registerEvent = async (req, res) => {
  const { name, startDate, endDate } = req.body;

  try {
    await eventsModel.registerEventByID(name, startDate, endDate);

    res.redirect("/events");
  } catch (error) {
    console.error(logError("registerEvent"), error);
    res.status(500).send(resError("registerEvent"));
  }
};

exports.deleteEvent = async (req, res) => {
  const { item: eventID } = req.body;

  try {
    await eventsModel.deleteEventByID(eventID);

    res.status(200).send("OH YES! Event Deleted Successfully");
  } catch (error) {
    console.error(logError("deleteEvent"), error);
    res.status(500).send(resError("deleteEvent"));
  }
};

exports.dropAllEvents = async (req, res) => {
  try {
    await eventsModel.dropAllEvents();
    return res.status(200).send("OH YES! All Events Dropped Successfully");
  } catch (error) {
    console.error(logError("dropAllEvents"), error);
    return res.status(500).send(resError("dropAllEvents"));
  }
};
