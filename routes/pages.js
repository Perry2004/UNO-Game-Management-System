const express = require("express");
const authController = require("../controllers/auth");
const dashboardController = require("../controllers/dashboard");

const router = express.Router();

router.get("/", authController.isLoggedIn, (req, res) => {
  if (req.loginStatus === true) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

router.get("/login", authController.isLoggedIn, (req, res) => {
  if (req.loginStatus === true) {
    res.redirect("/dashboard");
  } else {
    res.render("login");
  }
});

router.get("/dashboard", authController.isLoggedIn, dashboardController.loadDashboard);

module.exports = router;
