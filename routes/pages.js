const express = require("express");
const authController = require("../controllers/auth");
const dashboardController = require("../controllers/dashboard");
const eventsController = require("../controllers/events");
const matchesController = require("../controllers/matches");
const membershipsController = require("../controllers/memberships");
const storeItemsController = require("../controllers/store-items");

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

router.get("/dashboard/edit-modal/fetch-data", dashboardController.fetchPlayerData); 
router.get("/dashboard/create-modal/check-input", dashboardController.checkFormInput); 

router.post("/dashboard/update", dashboardController.updatePlayer); 
router.post("/dashboard/register", dashboardController.registerPlayer);
router.delete("/dashboard/delete", dashboardController.deletePlayer); 



router.get("/store-items", authController.isLoggedIn, storeItemsController.loadStoreItems);



router.get("/memberships", authController.isLoggedIn, membershipsController.loadMemberships);
router.post("/memberships", membershipsController.registerMembership);
router.get("/memberships/check-membership", membershipsController.checkMembership);
router.get("/memberships/fetch", membershipsController.fetchMembershipData);
router.post("/memberships/update", membershipsController.updateMembership);
router.delete("/memberships/delete", membershipsController.deleteMembership); 


/**
 * Events
 */
router.get("/events", authController.isLoggedIn, eventsController.loadEvents);
router.post("/events/create-event", eventsController.insertEvent) // event creation
router.get("/events/fetch-event", eventsController.fetchEvent) // fetch event information for edit field
router.post("/events/update-event", eventsController.updateEvent) // update event

router.delete("/events/delete", eventsController.deleteEvent); // TODO: can't fix 404.


router.get("/matches", authController.isLoggedIn, matchesController.loadMatches);

module.exports = router;
