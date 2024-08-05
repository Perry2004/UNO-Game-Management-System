-- DROP DATABASE IF EXISTS UNOGAMESYSTEM;
-- CREATE DATABASE UNOGAMESYSTEM;
USE UNOGAMESYSTEM;

CREATE TABLE
    IF NOT EXISTS PlayerUsernameAndEmail (
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        PRIMARY KEY (username)
    );

CREATE TABLE
    IF NOT EXISTS PlayerLevel (
        experience_point INT NOT NULL,
        level INT NOT NULL,
        PRIMARY KEY (experience_point),
        CHECK (experience_point <= 10000)
    );

CREATE TABLE
    IF NOT EXISTS Players (
        player_id INT AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        total_win INT DEFAULT 0,
        total_game_count INT DEFAULT 0,
        experience_point INT DEFAULT 0,
        win_rate FLOAT DEFAULT 0,
        country VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (player_id),
        FOREIGN KEY (username) REFERENCES PlayerUsernameAndEmail (username) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (experience_point) REFERENCES PlayerLevel (experience_point) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS MembershipPrivilegeClass (
        privilege_level INT NOT NULL,
        privilege_class VARCHAR(255) NOT NULL,
        PRIMARY KEY (privilege_level)
    );

CREATE TABLE
    IF NOT EXISTS Memberships (
        membership_id INT AUTO_INCREMENT,
        player_id INT NOT NULL,
        issue_date DATE NOT NULL,
        expire_date DATE NOT NULL,
        privilege_level INT NOT NULL,
        status VARCHAR(255),
        PRIMARY KEY (membership_id),
        FOREIGN KEY (player_id) REFERENCES Players (player_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (privilege_level) REFERENCES MembershipPrivilegeClass (privilege_level) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS Events (
        event_id INT AUTO_INCREMENT,
        name VARCHAR(255),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(255) NOT NULL,
        num_of_participants INT DEFAULT 0,
        PRIMARY KEY (event_id)
    );

CREATE TABLE
    IF NOT EXISTS Stores (
        store_id INT AUTO_INCREMENT,
        player_id INT NOT NULL,
        num_of_items INT,
        PRIMARY KEY (store_id),
        FOREIGN KEY (player_id) REFERENCES Players (player_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS ItemOriginalPrice (
        quality VARCHAR(255) NOT NULL,
        original_price INT NOT NULL,
        PRIMARY KEY (quality)
    );

CREATE TABLE
    IF NOT EXISTS ItemDiscount (
        applied_promotion VARCHAR(255) NOT NULL,
        discount INT NOT NULL,
        PRIMARY KEY (applied_promotion)
    );

CREATE TABLE
    IF NOT EXISTS Items (
        item_id INT AUTO_INCREMENT,
        current_price INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        quality VARCHAR(255) NOT NULL,
        applied_promotion VARCHAR(255),
        PRIMARY KEY (item_id),
        FOREIGN KEY (quality) REFERENCES ItemOriginalPrice (quality) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (applied_promotion) REFERENCES ItemDiscount (applied_promotion) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS StoreSellItems (
        store_id INT NOT NULL,
        item_id INT NOT NULL,
        PRIMARY KEY (store_id, item_id),
        FOREIGN KEY (store_id) REFERENCES Stores (store_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS Matches (
        match_id INT AUTO_INCREMENT,
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP,
        winner VARCHAR(255),
        status VARCHAR(255) DEFAULT 'In Process',
        PRIMARY KEY (match_id)
    );

CREATE TABLE
    IF NOT EXISTS Decks (
        deck_id INT AUTO_INCREMENT,
        total_cards INT DEFAULT 108,
        PRIMARY KEY (deck_id)
    );

CREATE TABLE
    IF NOT EXISTS CardInDeck (
        card_id INT NOT NULL,
        deck_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        has_played INT DEFAULT 0,
        PRIMARY KEY (card_id, deck_id),
        FOREIGN KEY (deck_id) REFERENCES Decks (deck_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS WildCard (
        card_id INT NOT NULL,
        deck_id INT NOT NULL,
        PRIMARY KEY (card_id, deck_id),
        FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck (card_id, deck_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS WildDraw4Card (
        card_id INT NOT NULL,
        deck_id INT NOT NULL,
        PRIMARY KEY (card_id, deck_id),
        FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck (card_id, deck_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS NumberCard (
        card_id INT NOT NULL,
        deck_id INT NOT NULL,
        number INT NOT NULL,
        color VARCHAR(255) NOT NULL,
        PRIMARY KEY (card_id, deck_id),
        FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck (card_id, deck_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS SkipCard (
        card_id INT NOT NULL,
        deck_id INT NOT NULL,
        color VARCHAR(255) NOT NULL,
        PRIMARY KEY (card_id, deck_id),
        FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck (card_id, deck_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS ReverseCard (
        card_id INT NOT NULL,
        deck_id INT NOT NULL,
        color VARCHAR(255) NOT NULL,
        PRIMARY KEY (card_id, deck_id),
        FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck (card_id, deck_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS Draw2Card (
        card_id INT NOT NULL,
        deck_id INT NOT NULL,
        color VARCHAR(255) NOT NULL,
        PRIMARY KEY (card_id, deck_id),
        FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck (card_id, deck_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS HandInPlayerAndMatch (
        hand_id INT NOT NULL,
        player_id INT NOT NULL,
        match_id INT NOT NULL,
        card_amount INT NOT NULL,
        PRIMARY KEY (hand_id, player_id, match_id),
        FOREIGN KEY (player_id) REFERENCES Players (player_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (match_id) REFERENCES Matches (match_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS TurnInPlayerAndMatch (
        turn_id INT NOT NULL,
        player_id INT NOT NULL,
        match_id INT NOT NULL,
        turn_order VARCHAR(255) NOT NULL,
        PRIMARY KEY (turn_id, player_id, match_id),
        FOREIGN KEY (player_id) REFERENCES Players (player_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (match_id) REFERENCES Matches (match_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS ActionInTurn (
        action_id INT NOT NULL,
        turn_id INT NOT NULL,
        player_id INT NOT NULL,
        match_id INT NOT NULL,
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (action_id, turn_id, player_id, match_id),
        FOREIGN KEY (turn_id, player_id, match_id) REFERENCES TurnInPlayerAndMatch (turn_id, player_id, match_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS SkipAction (
        action_id INT NOT NULL,
        turn_id INT NOT NULL,
        player_id INT NOT NULL,
        match_id INT NOT NULL,
        PRIMARY KEY (action_id, turn_id, player_id, match_id),
        FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES ActionInTurn (action_id, turn_id, player_id, match_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS DrawAction (
        action_id INT NOT NULL,
        turn_id INT NOT NULL,
        player_id INT NOT NULL,
        match_id INT NOT NULL,
        draw_amount INT NOT NULL,
        PRIMARY KEY (action_id, turn_id, player_id, match_id),
        FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES ActionInTurn (action_id, turn_id, player_id, match_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS PlayAction (
        action_id INT NOT NULL,
        turn_id INT NOT NULL,
        player_id INT NOT NULL,
        match_id INT NOT NULL,
        PRIMARY KEY (action_id, turn_id, player_id, match_id),
        FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES ActionInTurn (action_id, turn_id, player_id, match_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS PlayerContainItems (
        player_id INT NOT NULL,
        item_id INT NOT NULL,
        PRIMARY KEY (player_id, item_id),
        FOREIGN KEY (player_id) REFERENCES Players (player_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS PlayerParticipateEvents (
        player_id INT NOT NULL,
        event_id INT NOT NULL,
        PRIMARY KEY (player_id, event_id),
        FOREIGN KEY (player_id) REFERENCES Players (player_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (event_id) REFERENCES Events (event_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS PlayerInvolveMatches (
        player_id INT NOT NULL,
        match_id INT NOT NULL,
        PRIMARY KEY (player_id, match_id),
        FOREIGN KEY (player_id) REFERENCES Players (player_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (match_id) REFERENCES Matches (match_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS MatchHasDeck (
        match_id INT NOT NULL UNIQUE,
        deck_id INT NOT NULL UNIQUE,
        PRIMARY KEY (match_id, deck_id),
        FOREIGN KEY (match_id) REFERENCES Matches (match_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (deck_id) REFERENCES Decks (deck_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS CardHeldByHand (
        card_id INT NOT NULL,
        deck_id INT NOT NULL,
        hand_id INT NOT NULL,
        player_id INT NOT NULL,
        match_id INT NOT NULL,
        PRIMARY KEY (card_id, deck_id, hand_id, player_id, match_id),
        FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck (card_id, deck_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (hand_id, player_id, match_id) REFERENCES HandInPlayerAndMatch (hand_id, player_id, match_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS PlayActionFromCard (
        action_id INT NOT NULL,
        turn_id INT NOT NULL,
        player_id INT NOT NULL,
        match_id INT NOT NULL,
        card_id INT NOT NULL,
        deck_id INT NOT NULL,
        PRIMARY KEY (
            action_id,
            turn_id,
            player_id,
            match_id,
            card_id,
            deck_id
        ),
        FOREIGN KEY (action_id, turn_id, player_id, match_id) REFERENCES PlayAction (action_id, turn_id, player_id, match_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (card_id, deck_id) REFERENCES CardInDeck (card_id, deck_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- Insert Number Cards (0-9) for each color (Red, Yellow, Green, Blue)
-- Note: There are 19 cards for each color (one 0 and two of each 1-9)
-- Insert into Decks
INSERT INTO
    Decks (deck_id, total_cards)
VALUES
    (1, 108);

-- Red Number Cards
INSERT INTO
    CardInDeck (card_id, deck_id, name, has_played)
VALUES
    (1, 1, 'Red 0', 0),
    (2, 1, 'Red 1', 0),
    (3, 1, 'Red 1', 0),
    (4, 1, 'Red 2', 0),
    (5, 1, 'Red 2', 0),
    (6, 1, 'Red 3', 0),
    (7, 1, 'Red 3', 0),
    (8, 1, 'Red 4', 0),
    (9, 1, 'Red 4', 0),
    (10, 1, 'Red 5', 0),
    (11, 1, 'Red 5', 0),
    (12, 1, 'Red 6', 0),
    (13, 1, 'Red 6', 0),
    (14, 1, 'Red 7', 0),
    (15, 1, 'Red 7', 0),
    (16, 1, 'Red 8', 0),
    (17, 1, 'Red 8', 0),
    (18, 1, 'Red 9', 0),
    (19, 1, 'Red 9', 0);

INSERT INTO
    NumberCard (card_id, deck_id, number, color)
VALUES
    (1, 1, 0, 'Red'),
    (2, 1, 1, 'Red'),
    (3, 1, 1, 'Red'),
    (4, 1, 2, 'Red'),
    (5, 1, 2, 'Red'),
    (6, 1, 3, 'Red'),
    (7, 1, 3, 'Red'),
    (8, 1, 4, 'Red'),
    (9, 1, 4, 'Red'),
    (10, 1, 5, 'Red'),
    (11, 1, 5, 'Red'),
    (12, 1, 6, 'Red'),
    (13, 1, 6, 'Red'),
    (14, 1, 7, 'Red'),
    (15, 1, 7, 'Red'),
    (16, 1, 8, 'Red'),
    (17, 1, 8, 'Red'),
    (18, 1, 9, 'Red'),
    (19, 1, 9, 'Red');

-- Yellow Number Cards
INSERT INTO
    CardInDeck (card_id, deck_id, name, has_played)
VALUES
    (20, 1, 'Yellow 0', 0),
    (21, 1, 'Yellow 1', 0),
    (22, 1, 'Yellow 1', 0),
    (23, 1, 'Yellow 2', 0),
    (24, 1, 'Yellow 2', 0),
    (25, 1, 'Yellow 3', 0),
    (26, 1, 'Yellow 3', 0),
    (27, 1, 'Yellow 4', 0),
    (28, 1, 'Yellow 4', 0),
    (29, 1, 'Yellow 5', 0),
    (30, 1, 'Yellow 5', 0),
    (31, 1, 'Yellow 6', 0),
    (32, 1, 'Yellow 6', 0),
    (33, 1, 'Yellow 7', 0),
    (34, 1, 'Yellow 7', 0),
    (35, 1, 'Yellow 8', 0),
    (36, 1, 'Yellow 8', 0),
    (37, 1, 'Yellow 9', 0),
    (38, 1, 'Yellow 9', 0);

INSERT INTO
    NumberCard (card_id, deck_id, number, color)
VALUES
    (20, 1, 0, 'Yellow'),
    (21, 1, 1, 'Yellow'),
    (22, 1, 1, 'Yellow'),
    (23, 1, 2, 'Yellow'),
    (24, 1, 2, 'Yellow'),
    (25, 1, 3, 'Yellow'),
    (26, 1, 3, 'Yellow'),
    (27, 1, 4, 'Yellow'),
    (28, 1, 4, 'Yellow'),
    (29, 1, 5, 'Yellow'),
    (30, 1, 5, 'Yellow');

-- Insert sample players if not already available
INSERT INTO
    Players (username, country, password)
VALUES
    ('player1', 'USA', 'password1'),
    ('player2', 'UK', 'password2');

-- Insert sample match data if not already available
INSERT INTO
    Matches (match_id, winner, status)
VALUES
    (1, 'player1', 'Completed');

-- Insert TurnInPlayerAndMatch data
INSERT INTO
    TurnInPlayerAndMatch (turn_id, player_id, match_id, turn_order)
VALUES
    (1, 1, 1, 'First'),
    (2, 2, 1, 'Second');

-- Insert Sample Actions into ActionInTurn
INSERT INTO
    ActionInTurn (action_id, turn_id, player_id, match_id)
VALUES
    (1, 1, 1, 1), -- First action by player1 in turn 1
    (2, 2, 2, 1);

-- Another action by player2 in turn 2
-- Populate the specific actions
-- Insert DrawAction for player1's turn
INSERT INTO
    DrawAction (
        action_id,
        turn_id,
        player_id,
        match_id,
        draw_amount
    )
VALUES
    (1, 1, 1, 1, 2);

-- Player1 drew 2 cards in their first action
-- Insert a SkipAction for player2's turn
INSERT INTO
    SkipAction (action_id, turn_id, player_id, match_id)
VALUES
    (2, 2, 2, 1);

-- Player2 skipped their turn as their second action
-- Insert PlayAction for player1's next turn
INSERT INTO
    ActionInTurn (
        action_id,
        turn_id,
        player_id,
        match_id,
        time_stamp
    )
VALUES
    (3, 1, 1, 1, CURRENT_TIMESTAMP);

INSERT INTO
    PlayAction (action_id, turn_id, player_id, match_id)
VALUES
    (3, 1, 1, 1);

-- Player1 played a card in their third action
-- Link played card to the PlayAction (assume card_id = 5, deck_id = 1 exists in CardInDeck)
INSERT INTO
    PlayActionFromCard (
        action_id,
        turn_id,
        player_id,
        match_id,
        card_id,
        deck_id
    )
VALUES
    (3, 1, 1, 1, 5, 1);

-- Player1 played a card 'Red 2' in their PlayAction
-- Insert another action for player2 with a different action_id
INSERT INTO
    ActionInTurn (
        action_id,
        turn_id,
        player_id,
        match_id,
        time_stamp
    )
VALUES
    (4, 2, 2, 1, CURRENT_TIMESTAMP);

INSERT INTO
    PlayAction (action_id, turn_id, player_id, match_id)
VALUES
    (4, 2, 2, 1);

-- Player2 played a card in their action
-- Link played card to the PlayAction for player2 (assume card_id = 7, deck_id = 1 exists in CardInDeck)
INSERT INTO
    PlayActionFromCard (
        action_id,
        turn_id,
        player_id,
        match_id,
        card_id,
        deck_id
    )
VALUES
    (4, 2, 2, 1, 7, 1);

-- Player2 played a card 'Red 3' in their PlayAction