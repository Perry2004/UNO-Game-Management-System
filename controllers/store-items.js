const storeItemsModel = require("../models/store-items");

exports.loadStoreItems = async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const recentStores = await storeItemsModel.getRecentStores();
      const recentItems = await storeItemsModel.getRecentItems();

      res.render("store-items", { recentStores, recentItems });
    } catch (error) {
      console.error("OH NO! Error Loading Store Items:", error);
      res.status(500).send("OH NO! Internal Server Error with Loading Store Items");
    }
  } else {
    res.redirect("/login");
  }
};

exports.registerItem = async (req, res) => {
  try {
    const { name, quality, appliedPromotion } = req.body;
    console.log("In registerItem in controller: ", name, quality, appliedPromotion);
    await storeItemsModel.registerItem(name, quality, appliedPromotion);
    return res.redirect("/store-items");
  } catch (error) {
    console.error("OH NO! Error Registering Store Item:", error);
    return res.redirect("/store-items");
  }
}

exports.checkItemName = async (req, res) => {
  const { itemName } = req.query;
  console.log("item Name: ", itemName);
  try {
    if (await storeItemsModel.isItemNameRegistered(itemName)) {
      res.status(409).send("Item name already exists");
    } else {
      res.status(200).send("Item name is available");
    }
  } catch (error) {
    console.error("OH NO! Error Checking Item Name:", error);
    res.status(500).send("OH NO! Internal Server Error with Checking Item Name");
  }
}

exports.fetchDiscountData = async (req, res) => {
  const { appliedPromotion } = req.query;
  try {
    let discount = await storeItemsModel.fetchDiscountData(appliedPromotion);
    discount = String(discount);
    res.status(200).send(discount);
  } catch (error) {
    console.error("OH NO! Error Fetching Discount Data:", error);
    res.status(500).send("OH NO! Internal Server Error with Fetching Discount Data");
  }
}