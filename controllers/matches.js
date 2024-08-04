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
