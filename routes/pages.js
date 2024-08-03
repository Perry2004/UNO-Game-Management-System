const express = require("express");
const authController = require("../controllers/auth");
const searchResultsController = require("../controllers/search-results");
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

router.get("/search-results", searchResultsController.getSearchResults);

router.get("/dashboard", authController.isLoggedIn, dashboardController.loadDashboard);
router.get("/dashboard/fetch-playerID", dashboardController.fetchPlayerID); 
router.get("/dashboard/edit-modal/fetch-data", dashboardController.fetchPlayerData); 
router.get("/dashboard/create-modal/check-input", dashboardController.checkFormInput); 

router.post("/dashboard/update", dashboardController.updatePlayer); 
router.post("/dashboard/register", dashboardController.registerPlayer);
router.delete("/dashboard/delete", dashboardController.deletePlayer); 



router.get("/store-items", authController.isLoggedIn, storeItemsController.loadStoreItems);
router.post("/store-items", storeItemsController.registerItem);
router.get("/store-items/check-item-name", storeItemsController.checkItemName);
router.get("/store-items/fetch-discount", storeItemsController.fetchDiscountData);
router.delete("/store-items/delete", storeItemsController.deleteItem);
router.get("/store-items/fetch", storeItemsController.fetchItemData);
router.post("/store-items/update", storeItemsController.updateItem);
router.post("/store-items/insert", storeItemsController.insertItem);
router.get("/store-items/check-item-in-store", storeItemsController.checkItemInStore);
router.get("/store-items/fetch-store-items", storeItemsController.fetchStoreItems);
router.delete("/store-items/delete-store-item", storeItemsController.deleteStoreItem);



router.get("/memberships", authController.isLoggedIn, membershipsController.loadMemberships);
router.get("/memberships/edit-modal/fetch-data", membershipsController.fetchMembershipData);
router.get("/memberships/create-modal/check-membership", membershipsController.checkMembershipExistence);

router.post("/memberships/update", membershipsController.updateMembership);
router.post("/memberships/register", membershipsController.registerMembership);
router.delete("/memberships/delete", membershipsController.deleteMembership); 



router.get("/events", authController.isLoggedIn, eventsController.loadEvents);




router.get("/matches", authController.isLoggedIn, matchesController.loadMatches);

module.exports = router;
