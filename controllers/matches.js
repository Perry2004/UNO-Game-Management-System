const matchesModel = require("../models/matches");

const logError = (functionName) => `OH NO! Error with ${functionName} in Controllers:`;
const resError = (functionName) => `OH NO! Internal Server Error with ${functionName} in Controllers:`;

exports.loadMatches = async (req, res) => {
  if (!req.loginStatus) {
    return res.redirect("/login");
  }

  try {
    const recentMatches = await matchesModel.getRecentMatches();

    res.render("matches", { recentMatches });
  } catch (error) {
    console.error(logError("loadMatches"), error);
    res.status(500).send(resError("loadMatches"));
  }
};

exports.registerMatches = async (req, res) => {
  const { numOfPlayers } = req.body;
  const usernames = [];
  for (let i = 1; i <= numOfPlayers; i++) {
    usernames.push(req.body[`username${i}`]);
  }

  try {
    await matchesModel.registerMatches(usernames);
    console.log(`Successfully registered ${numOfPlayers} players for a new match.`);
    res.redirect("/matches");
  } catch (error) {
    console.error(logError("registerMatches"), error);
    res.status(500).redirect("/matches");
  }
};

exports.fetchMatchInfo = async (req, res) => {
  const { matchID } = req.query;

  try {
    const matchInfo = await matchesModel.fetchMatchInfo(matchID);
    res.status(200).send(matchInfo);
  } catch (error) {
    console.error(logError("fetchMatchInfo"), error);
    res.status(500).send(resError("fetchMatchInfo"));
  }
}

exports.fetchMatchPlayers = async (req, res) => {
  const { matchID } = req.query;

  try {
    const matchPlayers = await matchesModel.fetchMatchPlayers(matchID);
    // DEBUG
    // console.log("In controller: success fetching match players: ", matchPlayers); 
    res.status(200).send(matchPlayers);
  } catch (error) {
    console.error(logError("fetchMatchPlayers"), error);
    res.status(500).send(resError("fetchMatchPlayers"));
  }
}

exports.fetchMatchDetails = async (req, res) => {
  const { matchID } = req.query;

  try {
    const matchDetails = await matchesModel.fetchMatchDetails(matchID);
    res.status(200).send(matchDetails);
  } catch (error) {
    console.error(logError("fetchMatchDetails"), error);
    res.status(500).send(resError("fetchMatchDetails"));
  }
}