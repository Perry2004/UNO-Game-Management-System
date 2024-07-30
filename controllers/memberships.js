const { compareSync } = require("bcryptjs");
const membershipsModel = require("../models/memberships");

exports.loadMemberships = async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const recentMemberships = await membershipsModel.getRecentMemberships();

      res.render("memberships", { recentMemberships });
    } catch (error) {
      console.error("OH NO! Error Loading Memberships:", error);
      res.status(500).send("OH NO! Internal Server Error with Loading Memberships");
    }
  } else {
    res.redirect("/login");
  }
};

exports.registerMembership = async (req, res) => {
  const { username, duration, level } = req.body;

  try {
    if (!username || !duration || !level) {
      throw new Error("Form Incomplete... Please try again!");
    }
    await membershipsModel.registerMembership(username, duration, level);
    return res.redirect("/memberships");
  } catch (error) {
    console.error("Error registering membership:", error);
    return res.redirect("/memberships");
  }
};

exports.deleteMembership = async (req, res) => {
  const { username } = req.body;

  try {
    await membershipsModel.deleteMembershipByUsername(username);

    res.status(200).send(`${username} deleted successfully`);
  } catch (error) {
    console.error(`OH NO! Error Deleting ${username}:`, error);
    res.status(500).send("OH NO! Internal Server Error with Delete Player");
  }
};