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
  }
}

exports.fetchMatchInfo = async (matchID) => {
  try {
    const [results] = await db.promise().query(`
        SELECT start_time, end_time, winner
        FROM Matches
        WHERE match_id = ? 
      `, [matchID]);

    return results.map((element) => ({
      startTime: formatInTimeZone(element.start_time, timeZone, "yyyy-MM-dd HH:mm:ss zzz"),
      endTime: element.end_time ? formatInTimeZone(element.end_time, timeZone, "yyyy-MM-dd HH:mm:ss zzz") : "TBD",
      winner: element.winner || "TBD",
    }));

  } catch (error) {
    console.error("OH NO! Error fetching match details:", error);
    throw error;
  }
}

exports.fetchMatchPlayers = async (matchID) => {
  try {
    const [results] = await db.promise().query(`
        SELECT p.username
        FROM Players p
        JOIN PlayerInvolveMatches pim ON p.player_id = pim.player_id
        WHERE pim.match_id = ?
      `, [matchID]);

    let playerCountries = [];
    for (let i = 0; i < results.length; i++) {
      const playerCountry = (await db.promise().query(`SELECT country FROM Players WHERE username = ?`, [results[i].username]))[0][0].country;
      playerCountries.push(playerCountry);
    }

    for (let i = 0; i < results.length; i++) {
      results[i].country = playerCountries[i];
    }

    return results;

  } catch (error) {
    console.error("OH NO! Error fetching match players:", error);
    throw error;
  }
}

exports.fetchMatchDetails = async (matchID) => {
  try {
    // fetch: action time stamp, player username, action, additional info, num of cards in hand, num of cards in deck, current direction, next turn (username)
    const turns = await db.promise().query(`SELECT * FROM TurnInPlayerAndMatch WHERE match_id = ?`, [matchID]);
    const numOfTurns = turns[0].length;
    const turnIDs = [];
    for (let i = 0; i < numOfTurns; i++) {
      turnIDs.push(turns[0][i].turn_id);
    }

    let nextTurnIndex = 1;

    usernamesInMatch = (await db.promise().query(`SELECT p.username FROM Players p JOIN PlayerInvolveMatches pim ON p.player_id = pim.player_id WHERE pim.match_id = ?`, [matchID]))[0];
    usernamesInMatch = usernamesInMatch.map((element) => element.username);

    const matchDetails = [];

    // select * from TurnInPlayerAndMatch with the given match id to get all the turns
    // use the turn ids to get all the actions for each turn
    // sort the actions by time stamp
    // return the time stamp, player username, action name, and current direction

    // turn-by-turn
    for (let i = 0; i < numOfTurns; i++) {
      const turn = turns[0][i];
      const turnID = turn.turn_id;
      const playerID = turn.player_id;
      const playerUsername = (await db.promise().query(`SELECT username FROM Players WHERE player_id = ?`, [playerID]))[0][0].username;

      const skipActions = (await db.promise().query(`SELECT * FROM SkipAction WHERE turn_id = ?`, [turnID]))[0][0];
      const drawActions = (await db.promise().query(`SELECT * FROM DrawAction WHERE turn_id = ?`, [turnID]))[0][0];
      const playActions = (await db.promise().query(`SELECT * FROM PlayAction WHERE turn_id = ?`, [turnID]))[0][0];

      let validAction = null;
      if (skipActions) {
        validAction = skipActions;
        validAction.type = "Skip";
      } else if (drawActions) {
        validAction = drawActions;
        validAction.type = "Draw";
      } else if (playActions) {
        validAction = playActions;
        validAction.type = "Play";
      }

      // if action is play, get card info
      let playedCards = [];
      if (validAction.type === "Play" || validAction.type === "Draw") {
        // card types: Wild Card, Wild Draw 4 Card, Number Card, Skip Card, Reverse Card, Draw 2 Card
        cardTypes = ["WildCard", "WildDraw4Card", "NumberCard", "SkipCard", "ReverseCard", "Draw2Card"];

        // try loop through the four table and check which one has the card
        for (let i = 0; i < cardTypes.length; i++) {
          const cardsInAction = ((await db.promise().query(`
            SELECT * FROM ${cardTypes[i]} p
            JOIN PlayActionFromCard pa ON p.card_id = pa.card_id 
            WHERE pa.match_id = ? AND pa.turn_id = ?
            `, [matchID, turnID]))[0]);
          if (cardsInAction.length > 0) {
            cardsInAction.forEach((element) => {
              element.cardType = cardTypes[i];
              playedCards.push(element);
            });
            break;
          } else {
          }
        }
      }

      validAction.username = playerUsername;

      const timeStamp = (await db.promise().query(`SELECT time_stamp FROM ActionInTurn WHERE turn_id = ?`, [turnID]))[0][0].time_stamp;
      localizedTimeStamp = formatInTimeZone(timeStamp, timeZone, "yyyy-MM-dd HH:mm:ss zzz");
      validAction.timeStamp = localizedTimeStamp;

      const handOfPlayer = (await db.promise().query(`SELECT * FROM HandInPlayerAndMatch WHERE player_id = ?`, [playerID]))[0][0];
      validAction.numOfCardsInHand = handOfPlayer.card_amount;

      const numOfCardsInDeck = (await db.promise().query(`
        SELECT * FROM MatchHasDeck
        JOIN Decks ON MatchHasDeck.deck_id = Decks.deck_id
        WHERE match_id = ?
      `, [matchID]))[0][0].total_cards;
      validAction.numOfCardsInDeck = numOfCardsInDeck;

      const turnOrder = (await db.promise().query(`SELECT * FROM TurnInPlayerAndMatch WHERE match_id = ? AND turn_id = ?`, [matchID, turnID]))[0][0];
      validAction.currentDirection = turnOrder.turn_order;

      if (validAction.currentDirection === "clockwise") {
        validAction.nextTurn = usernamesInMatch[nextTurnIndex];
        nextTurnIndex = (nextTurnIndex + 1) % usernamesInMatch.length;
      } else {
        validAction.nextTurn = usernamesInMatch[nextTurnIndex];
        nextTurnIndex = (nextTurnIndex - 1 + usernamesInMatch.length) % usernamesInMatch.length;
      }

      if (validAction.type === "Play" || validAction.type === "Draw") {
        validAction.playedCards = playedCards;
      }

      matchDetails.push(validAction);
    }
    // DEBUG
    // console.log("In model, matchDetails:", matchDetails);

    return matchDetails;
  } catch (error) {
    console.error("OH NO! Error fetching match details for match:", matchID, error);
    throw error;
  }
}