const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.getRecentPlayers = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT
        player_id AS playerID,
        username AS username, 
        total_win AS totalWin,
        total_game_count AS totalGameCount,
        win_rate AS winRate,
        experience_point AS experiencePoint,
        country AS country
      FROM Players
      ORDER BY player_id DESC LIMIT 5;
    `);

    return results;
  } catch (error) {
    console.error("OH NO! Error fetching recent players:", error);
    throw error;
  }
};
