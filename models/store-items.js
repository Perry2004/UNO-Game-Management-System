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
        ORDER BY s.player_id DESC;
    `);

    return results;
  } catch (error) {
    console.error("OH NO! Error fetching recent stores:", error.message);
    throw error;
  }
};

exports.getRecentItems = async (order) => {
  let orderByClause;

  switch (order) {
    case "recent":
      orderByClause = "i.item_id";
      break;
    case "quality":
      orderByClause = "iop.original_price";
      break;
    case "currentPrice":
      orderByClause = "i.current_price";
      break;
    case "discount":
      orderByClause = "id.discount";
      break;
    default:
      orderByClause = "i.item_id";
  }

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
        ORDER BY ${orderByClause} DESC;
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

  await db.promise().query(
    `
    INSERT INTO Items (name, quality, current_price, applied_promotion) 
    VALUES (?, ?, ?, ?)
    `,
    [name, quality, currentPrice, appliedPromotion]
  );

  console.log("Item registered successfully");
};

exports.isItemNameRegistered = async (name) => {
  const [results] = await db.promise().query(`SELECT * FROM Items WHERE name = ?`, [name]);
  return results.length > 0;
};

exports.fetchDiscountData = async (appliedPromotion) => {
  const [results] = await db.promise().query(`SELECT discount FROM ItemDiscount WHERE applied_promotion = ?`, [appliedPromotion]);
  return results[0].discount;
};

exports.deleteItemByID = async (itemID) => {
  // first delete from StoreSellItems and decrease num_of_items in Stores
  let storeID = await db.promise().query(`SELECT store_id FROM StoreSellItems WHERE item_id = ?`, [itemID]);
  if (storeID[0].length !== 0) {
    storeID = storeID[0][0].store_id;
    await db.promise().query(`DELETE FROM StoreSellItems WHERE item_id = ?`, [itemID]);
    // use WHERE EXISTS to decrease num_of_items for all stores that have the item
    await db
      .promise()
      .query(`UPDATE Stores SET num_of_items = num_of_items - 1 WHERE EXISTS (SELECT * FROM StoreSellItems WHERE store_id = ?)`, [storeID]);
  }

  await db.promise().query(`DELETE FROM Items WHERE item_id = ?`, [itemID]);
  console.log(`Item ${itemID} deleted successfully`);
};

exports.fetchItemData = async (itemID) => {
  const [results] = await db.promise().query(
    `
    SELECT *
    FROM Items
    WHERE item_id = ?
  `,
    [itemID]
  );
  return results[0];
};

exports.updateItemByID = async (itemID, name, quality, appliedPromotion) => {
  const originalPrice = (await db.promise().query(`SELECT original_price FROM ItemOriginalPrice WHERE quality = ?`, [quality]))[0][0].original_price;
  const discount = (await db.promise().query(`SELECT discount FROM ItemDiscount WHERE applied_promotion = ?`, [appliedPromotion]))[0][0].discount;
  const currentPrice = originalPrice * (1 - discount / 100);
  await db
    .promise()
    .query(`UPDATE Items SET name = ?, quality = ?, current_price = ?, applied_promotion = ? WHERE item_id = ?`, [
      name,
      quality,
      currentPrice,
      appliedPromotion,
      itemID,
    ]);
};

exports.insertItem = async (itemID, username) => {
  let playerID = await db.promise().query(`SELECT player_id FROM Players WHERE username = ?`, [username]);
  playerID = playerID[0][0].player_id;

  let storeID = await db.promise().query(`SELECT store_id FROM Stores WHERE player_id = ?`, [playerID]);
  storeID = storeID[0][0].store_id;
  // update StoreSellItems
  await db.promise().query(`INSERT INTO StoreSellItems (store_id, item_id) VALUES (?, ?)`, [storeID, itemID]);

  // update Store.num_of_items
  await db.promise().query(`UPDATE Stores SET num_of_items = num_of_items + 1 WHERE store_id = ?`, [storeID]);
};

exports.isItemInStore = async (itemID, playerID) => {
  let storeID = await db.promise().query(`SELECT store_id FROM Stores WHERE player_id = ?`, [playerID]);
  storeID = storeID[0][0].store_id;

  const [results] = await db.promise().query(`SELECT * FROM StoreSellItems WHERE store_id = ? AND item_id = ?`, [storeID, itemID]);
  return results.length > 0;
};

exports.getStoreItems = async (storeID) => {
  const [results] = await db.promise().query(
    `
    SELECT i.item_id, i.name, i.quality, i.current_price, i.applied_promotion, iop.original_price, id.discount
    FROM Items i
    JOIN ItemOriginalPrice iop ON i.quality = iop.quality
    JOIN ItemDiscount id ON i.applied_promotion = id.applied_promotion
    JOIN StoreSellItems ssi ON i.item_id = ssi.item_id
    WHERE ssi.store_id = ?
    ORDER BY i.item_id
  `,
    [storeID]
  );
  return results;
};

exports.deleteStoreItem = async (itemID, storeID) => {
  // DEBUG
  console.log("In deleteStoreItem in model, storeID: ", storeID, "itemID: ", itemID);
  await db.promise().query(`DELETE FROM StoreSellItems WHERE store_id = ? AND item_id = ?`, [storeID, itemID]);
  // DEBUG
  console.log(`DELETE FROM StoreSellItems WHERE store_id = ${storeID} AND item_id = ${itemID}`);
  console.log("Deleted from StoreSellItems");
  await db.promise().query(`UPDATE Stores SET num_of_items = num_of_items - 1 WHERE store_id = ?`, [storeID]);
  // DEBUG
  console.log("Decreased num_of_items in Stores");
};
