const db = require("../config/db");

exports.getRecentStores = async () => {
  try {
    const [results] = await db.promise().query(`
        Select 
            s.store_id AS storeID, 
            s.num_of_items AS numOfItems,
            p.username AS username, 
            p.player_id AS playerID
        FROM Stores s
        JOIN Players p ON s.player_id = p.player_id
        ORDER BY s.player_id DESC LIMIT 3; 
    `);

    return results;
  } catch (error) {
    console.error("OH NO! Error fetching recent stores:", error.message);
    throw error;
  }
};

exports.getRecentItems = async () => {
  try {
    const [results] = await db.promise().query(`
        SELECT 
            i.name AS itemName, 
            i.item_id AS itemID,
            i.quality AS itemQuality, 
            i.current_price AS itemCurrentPrice, 
            iop.original_price AS itemOriginalPrice, 
            i.applied_promotion AS itemAppliedPromotion,
            id.discount AS itemDiscount
        FROM Items i
        JOIN ItemOriginalPrice iop ON i.quality = iop.quality
        JOIN ItemDiscount id ON i.applied_promotion = id.applied_promotion
        ORDER BY item_id DESC LIMIT 4; 
    `);

    return results.map((element) => ({
      itemName: element.itemName,
      itemID: element.itemID,
      itemQuality: element.itemQuality,
      itemCurrentPrice: "$" + element.itemCurrentPrice,
      itemOriginalPrice: "$" + element.itemOriginalPrice,
      itemAppliedPromotion: element.itemAppliedPromotion,
      itemDiscount: element.itemDiscount + "% OFF",
    }));
  } catch (error) {
    console.error("OH NO! Error fetching recent items:", error.message);
    throw error;
  }
};

exports.registerItem = async (name, quality, appliedPromotion) => {
  // get the original price 
  let originalPrice = await db.promise().query(`SELECT original_price FROM ItemOriginalPrice WHERE quality = ?`, [quality]);
  originalPrice = originalPrice[0][0].original_price;


  // get discount 
  let discount = await db.promise().query(`SELECT discount FROM ItemDiscount WHERE applied_promotion = ?`, [appliedPromotion]);
  discount = discount[0][0].discount;
  let currentPrice = originalPrice * (1 - discount / 100);


  await db.promise().query(`
    INSERT INTO Items (name, quality, current_price, applied_promotion) 
    VALUES (?, ?, ?, ?)
    `, [name, quality, currentPrice, appliedPromotion]);

  console.log("Item registered successfully");
}

exports.isItemNameRegistered = async (name) => {
  const [results] = await db.promise().query(`SELECT * FROM Items WHERE name = ?`, [name]);
  return results.length > 0;
}

exports.fetchDiscountData = async (appliedPromotion) => {
  const [results] = await db.promise().query(`SELECT discount FROM ItemDiscount WHERE applied_promotion = ?`, [appliedPromotion]);
  return results[0].discount;
}

exports.deleteItemByID = async (itemID) => {
  await db.promise().query(`DELETE FROM Items WHERE item_id = ?`, [itemID]);
  console.log(`Item ${itemID} deleted successfully`);
}