const { formatInTimeZone } = require("date-fns-tz");
const db = require("../config/db");
const { format } = require("date-fns");
const timeZone = "America/Vancouver";


exports.getRecentMemberships = async () => {
  try {
    const [results] = await db.promise().query(`
        SELECT 
            p.username AS username,
            mp.issue_time AS membershipIssueTime,
            mp.days_remaining AS membershipDaysRemaining,
            mpc.privilege_class AS membershipPrivilegeClass,
            mp.privilege_level AS membershipPrivilegeLevel,
            mp.status AS membershipStatus
        FROM MembershipInPlayer mp
        JOIN Players p ON mp.player_id = p.player_id
        JOIN MembershipExpireDate me ON mp.issue_time = me.issue_time AND mp.days_remaining = me.days_remaining
        JOIN MembershipPrivilegeClass mpc ON mp.privilege_level = mpc.privilege_level
        ORDER BY mp.player_id DESC LIMIT 10; 
    `);

    return results.map((element) => ({
      username: element.username,
      membershipIssueTime: formatInTimeZone(element.membershipIssueTime, timeZone, "yyyy-MM-dd HH:mm:ss zzz"),
      membershipDaysRemaining: element.membershipDaysRemaining,
      membershipPrivilegeClass: element.membershipPrivilegeClass,
      membershipPrivilegeLevel: element.membershipPrivilegeLevel,
      membershipStatus: element.membershipStatus,
    }));
  } catch (error) {
    console.error("OH NO! Error fetching recent memberships:", error.message);
    throw error;
  }
};

exports.registerMembership = async (username, duration, privilegeLevel) => {
  try {
    currentDate = new Date();
    expireDate = new Date(currentDate);
    expireDate.setDate(expireDate.getDate() + duration);

    console.log("Current Date:", currentDate);
    console.log("Duration:", duration);
    console.log("Expire Date:", expireDate);


    [results, fields] = await db.promise().query("SELECT player_id FROM Players WHERE username = ?", [username]);

    playerID = results[0].player_id;
    if (!playerID) {
      throw new Error("Player not found");
    }

    // first insert into MembershipExpireDate because of foreign key constraint
    console.log("expireDate:", expireDate);
    await db.promise().query("INSERT INTO MembershipExpireDate SET ?", { issue_time: currentDate, days_remaining: duration, expire_time: expireDate });
    if (results.affectedRows === 0) {
      throw new Error("Failed to insert into MembershipExpireDate");
    }

    // insert into MembershipInPlayer
    await db.promise().query("INSERT INTO MembershipInPlayer SET ?", { player_id: playerID, issue_time: currentDate, days_remaining: duration, privilege_level: privilegeLevel, status: "Active" });
    console.log("Membership inserted");

  } catch (error) {
    console.error("OH NO! Error during register membership:", error.message);
    throw error;
  }
}