const { formatInTimeZone } = require("date-fns-tz");
const db = require("../config/db");
const { format, differenceInCalendarMonths, longFormatters, constructFrom } = require("date-fns");
const logError = (functionName) => `OH NO! Error with ${functionName} in Models:`;
const timeZone = "America/Vancouver";

exports.getRecentMemberships = async (order) => {
  try {
    await updateMembershipStatus();

    let orderByClause;
    switch (order) {
      case "issueDate":
        orderByClause = "mp.issue_time";
        break;
      case "daysRemaining":
        orderByClause = "mp.expire_time";
        break;
      case "privilegeLevel":
        orderByClause = "mpc.privilege_level";
        break;
      case "status":
        orderByClause = "mp.status";
        break;
      default:
        orderByClause = "mp.issue_time";
    }

    const [results] = await db.promise().query(`
        SELECT 
            p.username AS username,
            p.player_id AS playerID,
            mp.issue_time AS membershipIssueTime,
            mp.expire_time AS membershipExpireTime,
            mpc.privilege_class AS membershipPrivilegeClass,
            mp.privilege_level AS membershipPrivilegeLevel,
            mp.status AS membershipStatus
        FROM MembershipInPlayer mp
        JOIN Players p ON mp.player_id = p.player_id
        JOIN MembershipPrivilegeClass mpc ON mp.privilege_level = mpc.privilege_level
        ORDER BY ${orderByClause} DESC LIMIT 10; 
    `);

    // if the list is empty, just return an empty list
    if (results.length === 0) {
      return [];
    }

    return results.map((element) => ({
      username: element.username,
      playerID: element.playerID,
      membershipIssueTime: formatInTimeZone(element.membershipIssueTime, timeZone, "yyyy-MM-dd"),
      membershipExpireTime: formatInTimeZone(element.membershipExpireTime, timeZone, "yyyy-MM-dd"),
      membershipDaysRemaining: dateDiffInDays(
        new Date().toISOString().split("T")[0],
        new Date(element.membershipExpireTime.toISOString().split("T")[0])
      ) > 0 ? dateDiffInDays(new Date().toISOString().split("T")[0], new Date(element.membershipExpireTime.toISOString().split("T")[0])) : 0,
      membershipPrivilegeClass: element.membershipPrivilegeClass,
      membershipPrivilegeLevel: element.membershipPrivilegeLevel,
      membershipStatus: element.membershipStatus,
    }));
  } catch (error) {
    console.error(logError("getRecentMemberships"), error.message);
    throw error;
  }
};

function dateDiffInDays(a, b) {
  a = new Date(a);
  b = new Date(b);

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

exports.registerMembership = async (username, duration, privilegeLevel) => {
  try {
    currentDate = new Date();
    // expire date = current date + duration
    expireDate = new Date(new Date().getTime() + duration * 24 * 60 * 60 * 1000);
    console.log("Current date: ", currentDate, "Expire date: ", expireDate, "Duration: ", duration);

    [results, fields] = await db.promise().query("SELECT player_id FROM Players WHERE username = ?", [username]);

    if (results.length === 0) {
      throw new Error("Username does not exist");
    }
    playerID = results[0].player_id;

    // insert into MembershipInPlayer
    await db
      .promise()
      .query("INSERT INTO MembershipInPlayer SET ?", {
        player_id: playerID,
        issue_time: currentDate,
        expire_time: expireDate,
        privilege_level: privilegeLevel,
        status: "Active",
      });
    console.log("Membership inserted");
    console.log("Issue date: ", currentDate, "Expire date: ", expireDate);
  } catch (error) {
    console.error("OH NO! Error during register membership:", error.message);
    throw error;
  }
};

exports.deleteMembershipByUsername = async (playerID) => {
  try {
    membershipID = await db.promise().query("SELECT membership_id FROM MembershipInPlayer WHERE player_id = ?", [playerID]);
    membershipID = membershipID[0][0].membership_id;
    issueTime = await db.promise().query("SELECT issue_time FROM MembershipInPlayer WHERE player_id = ?", [playerID]);
    issueTime = issueTime[0][0].issue_time;

    await db.promise().query("DELETE FROM MembershipInPlayer WHERE player_id = ?", [playerID]);

    console.log("Membership deleted successfully.");
  } catch (error) {
    console.error(logError("deleteMembershipByUsername"), error.message);
    throw error;
  }
};

/**
 * Return true if invalid, false if valid
 */
exports.isUsernameRegistered = async (username) => {
  console.log("Entered isUsernameRegistered");
  playerID = await db.promise().query("SELECT player_id FROM Players WHERE username = ?", [username]);
  if (playerID[0].length === 0) {
    console.log("Username does not exist");
    return true;
  }
  playerID = playerID[0][0].player_id;
  console.log("Player ID (in isUsernameRegistered): ", playerID);
  membershipID = await db.promise().query("SELECT membership_id FROM MembershipInPlayer WHERE player_id = ?", [playerID]);
  if (membershipID[0].length === 0) {
    console.log("Username does not have a membership");
    return false;
  } else {
    console.log("Username already has a membership");
    console.log("Membership ID: ", membershipID[0][0].membership_id);
    return true;
  }
};

exports.fetchMembershipByPlayerID = async (playerID) => {
  try {
    const [results] = await db.promise().query(
      `
        SELECT 
            p.username AS username,
            p.player_id AS playerID,
            mp.issue_time AS membershipIssueTime,
            mp.expire_time AS membershipExpireTime,
            mpc.privilege_class AS membershipPrivilegeClass,
            mp.privilege_level AS membershipPrivilegeLevel,
            mp.status AS membershipStatus
        FROM MembershipInPlayer mp
        JOIN Players p ON mp.player_id = p.player_id
        JOIN MembershipPrivilegeClass mpc ON mp.privilege_level = mpc.privilege_level
        WHERE mp.player_id = ?;
    `,
      [playerID]
    );
    results[0].membershipDaysRemaining = dateDiffInDays(
      new Date().toISOString().split("T")[0],
      new Date(results[0].membershipExpireTime.toISOString().split("T")[0])
    );
    return results[0];
  } catch (error) {
    console.error(logError("fetchMembershipByPlayerID"), error.message);
    throw error;
  }
};

exports.updateMembership = async (username, playerID, issueTime, expireDate, privilegeLevel) => {
  try {
    console.log(
      "Trying to update: username: ",
      username,
      " playerID: ",
      playerID,
      " issueTime: ",
      issueTime,
      " expireDate: ",
      expireDate,
      " privilegeLevel: ",
      privilegeLevel,
    );

    issueTime = new Date();
    expireTime = new Date(expireDate);
    // if the current time is before the expire time, the status is active
    let status = new Date() < expireTime ? "Active" : "Expired";

    issueTime = issueTime.toISOString().split("T")[0];
    expireTime = expireTime.toISOString().split("T")[0];

    console.log("Issue date: ", issueTime, "Expire date: ", expireDate);
    await db
      .promise()
      .query("UPDATE MembershipInPlayer SET issue_time = ?, expire_time = ?, privilege_level = ?, status = ? WHERE player_id = ?", [
        issueTime,
        expireDate,
        privilegeLevel,
        status,
        playerID,
      ]);
  } catch (error) {
    console.error(logError("updateMembership"), error.message);
    throw error;
  }
};

async function updateMembershipStatus() {
  try {
    const [results] = await db.promise().query("SELECT * FROM MembershipInPlayer");
    for (let i = 0; i < results.length; i++) {
      const membership = results[i];
      const expireTime = new Date(membership.expire_time);
      expireTime.setHours(0, 0, 0, 0);
      currentTime = new Date();
      currentTime.setHours(0, 0, 0, 0);
      const status = currentTime <= expireTime ? "Active" : "Expired";
      await db.promise().query("UPDATE MembershipInPlayer SET status = ? WHERE player_id = ?", [status, membership.player_id]);
    }
  } catch (error) {
    console.error(logError("updateMembershipStatus"), error.message);
    throw error;
  }
}