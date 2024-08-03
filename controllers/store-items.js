const storeItemsModel = require("../models/store-items");

exports.loadStoreItems = async (req, res) => {
  if (req.loginStatus === true) {
    try {

      const { order } = req.query;

      const recentStores = await storeItemsModel.getRecentStores();
      const recentItems = await storeItemsModel.getRecentItems(order);

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

exports.deleteItem = async (req, res) => {
  const { item: itemID } = req.body;
  try {
    await storeItemsModel.deleteItemByID(itemID);
    res.status(200).send(`${itemID} deleted successfully`);
  } catch (error) {
    console.error(`OH NO! Error Deleting ${itemID}:`, error);
    res.status(500).send("OH NO! Internal Server Error with Deleting Item");
  }
}

exports.fetchItemData = async (req, res) => {
  try {
    const { itemID } = req.query;
    const itemData = await storeItemsModel.fetchItemData(itemID);
    res.status(200).json(itemData);
  } catch (error) {
    console.error("OH NO! Error Fetching Item Data:", error);
    res.status(500).send("OH NO! Internal Server Error with Fetching Item Data");
  }
}

exports.updateItem = async (req, res) => {
  try {
    const { itemID, name, quality, appliedPromotion } = req.body;
    await storeItemsModel.updateItemByID(itemID, name, quality, appliedPromotion);
    console.log(`Item ${itemID} updated successfully`);
    res.status(200).redirect("/store-items");
  } catch (error) {
    console.error("OH NO! Error Updating Item:", error);
    res.status(500).redirect("/store-items");
  }
}

exports.insertItem = async (req, res) => {
  try {
    const { itemID, username } = req.body;
    // DEBUG
    console.log("In insertItem in controller: ", "itemID: ", itemID, "username: ", username);
    await storeItemsModel.insertItem(itemID, username);
    res.status(200).redirect("/store-items");
  } catch (error) {
    console.error("OH NO! Error Inserting Item:", error);
    res.status(500).redirect("/store-items");
  }
}

exports.checkItemInStore = async (req, res) => {
  const { itemID, playerID } = req.query;
  if (await storeItemsModel.isItemInStore(itemID, playerID)) {
    res.status(200).send("Item is in store");
  } else {
    res.status(404).send("Item is not in store");
  }

}

exports.fetchStoreItems = async (req, res) => {
  const { storeID } = req.query;
  try {
    const storeItems = await storeItemsModel.getStoreItems(storeID);
    res.status(200).json(storeItems);
  } catch (error) {
    console.error("OH NO! Error Fetching Store Items:", error);
    res.status(500).send("OH NO! Internal Server Error with Fetching Store Items");
  }
}

exports.deleteStoreItem = async (req, res) => {
  const { itemID, storeID } = req.query;
  // DEBUG
  console.log("In deleteStoreItem in controller: ", "itemID: ", itemID, "storeID: ", storeID);
  try {
    await storeItemsModel.deleteStoreItem(itemID, storeID);
    console.log(`Item ${itemID} deleted successfully from Store ${storeID}`);
    res.status(200).send(`${itemID} deleted successfully`);
  } catch (error) {
    console.error(`OH NO! Error Deleting ${itemID} from Store ${storeID}:`, error);
    res.status(500).send("OH NO! Internal Server Error with Deleting Store Item");
  }
}