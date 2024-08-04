const db = require("../config/db");
const { formatInTimeZone } = require("date-fns-tz");

const timeZone = "America/Vancouver";

exports.getRecentMatches = async () => {
  try {
    const [results] = await db.promise().query(`
        SELECT 
            match_id AS matchID, 
            start_time AS matchStartTime, 
            end_time AS matchEndTime, 
            winner AS matchWinner, 
            status AS matchStatus
        FROM Matches 
        ORDER BY match_id DESC 
        LIMIT 10
    `);

    return results.map((element) => ({
      matchID: element.matchID,
      matchStartTime: formatInTimeZone(element.matchStartTime, timeZone, "yyyy-MM-dd HH:mm:ss zzz"),
      matchEndTime: element.matchEndTime ? formatInTimeZone(element.matchEndTime, timeZone, "yyyy-MM-dd HH:mm:ss zzz") : "TBD",
      matchWinner: element.matchWinner || "TDB",
      matchStatus: element.matchStatus,
    }));
  } catch (error) {
    console.error("OH NO! Error fetching recent matches:", error.message);
    throw error;
  }
};

exports.registerMatches = async (usernames) => {
  // create a new match
  await db.promise().query(`INSERT INTO Matches (status) VALUES ('In Process')`);
  // get the match id
  const [matchID] = await db.promise().query(`SELECT LAST_INSERT_ID() AS matchID`);

  const playerIDs = [];
  for (let i = 0; i < usernames.length; i++) {
    const [playerID] = await db.promise().query(`SELECT player_id FROM Players WHERE username = ?`, [usernames[i]]);
    playerIDs.push(playerID[0].player_id);
  }

  // insert the players into the match
  while (playerIDs.length) {
    const playerID = playerIDs.shift();
    await db.promise().query(`INSERT INTO PlayerInvolveMatches (match_id, player_id) VALUES (?, ?)`, [matchID[0].matchID, playerID]);
    // DEBUG
    console.log("In model: playerID:", playerID, "matchID:", matchID[0].matchID);
  }
}