const searchResultsModel = require("../models/search-results");

const logError = (functionName) =>
  `OH NO! Error with ${functionName} in Search-Results Controllers:`;
const resError = (functionName) =>
  `OH NO! Internal Server Error with ${functionName} in Search-Results Controllers:`;

exports.getSearchResults = async (req, res) => {
  const { queryType, number } = req.query;

  try {
    const results = await searchResultsModel.getSearchResultData(
      queryType,
      number
    );

    const columnNames = results.length > 0 ? Object.keys(results[0]) : [];

    res.render("search-results", {
      columnData: results,
      columnNames: columnNames,
    });
  } catch (error) {
    console.error(logError("getSearchResults"), error);
    res.render("search-results", { columnData: [], columnNames: [] });
  }
};
