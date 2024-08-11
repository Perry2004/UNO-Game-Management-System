# UNO GAME USERS AND GAME STATE MANAGER

> For information on <b>local</b> machine setup please refer to the bottom of this file.

The Game State Management encompasses the entire game state of an
Uno Game. For example, the cards held by each player, the type of cards
held by each player, the cards remaining in the deck. and whose turn it is.
A real-life situation would of course be a group of individuals engaged in
a (virtual) game of Uno.This addresses the issue of tracking game states.
For “Logistics for Game App Users’ information,” we keep track of
virtual items that players have linked to their accounts e.g. badges, avatars,
and virtual characters. We also track player transactions using Stores, and
we allow Players to participate in "LuckyDraws" which grant them items on
a sporadic basis.
A real-life situation to which this can be
assimilated, is an online platform for a card game where players have
accounts with virtual characters that represent them inside the game, and
have items (badges etc.) linked to their account. This addresses the issue
of account management. Furthermore, this database could also be
modified briefly to apply in any online card game environment such as
“Exploding Kittens”.

---

We divided the backend (specificaly the database tables (relations)) such that all 3 of us have equivalent effort put in.
For the frontend, we divide the tasks in a similar manner so all members have equal contribution to the final Product.

To be more specific each contributor gets an appropirate amount of work. If this is not reflected herein, then it would be represented
inside below. The **main** idea is that all participants contribute equally. A decomposition into tasks was not required as each
page was assigned to a unique participant (one to many), and therefore the User Stories assigned indicate the tasks assigned, as well.

We divided the front-end (the React components) equally (in the manner above; one to many). Sufficient time was expended to determine viable table, which may be inquired by our TA mentor.

Yuchen, Muhammad, and Perry have an quivalent number of tables to design. This is intentionally left somewhat vague as we must confer with our mentor to reduce the amount of tables. But at present, the division is such that equity of particiaption is maintained.
We also divided the front-end (the React components) equally (in the manner above; one to many).

---

# Timeline

## Landing Page (front-end) (User Login): Assigned to Yuchen (due by July 28th)

- Allow for a User to login using their credentials, entering them into rendered text fields.
- Ensure that a User is redirected to a page upon button click and authentication that renders their information appropriate to them i.e. their characters, items, inventories et cetera (in the form of images) This refers to the Dashboard Page.

## Landing Page (back-end): Assigned to Yuchen (due by July 28th)

- Implement back-end NoSQL logic for keeping track of all the players who are part of the application.
- Implement the Database tables using appropriate commands and ensure that integrity constraints are upheld.
- Implement appropriate querying and insertion for the respective users for login.

## Dashboard Page (front-end): Assigned to Perry (due by July 29th)

= Allow for a User to see all information appropariate to them e.g. their statistics and their characters et cetera, using icons.

- Ensure that the images or text boxes do not display clutter when viewed on a standard Browser.

## Dashboard Page (backend-end): Assigned to Perry (due by July 29th)

- Ensure that information appropriate to the user in question is displayed in a readable format and that they can only access information relevant to them.

## Membership Page (back-end and front-end): Assigned to Perry (due by July 30th)

- Allow a User to keep track of their membership and their accumulated points (in a graphical-readable format).
- Ensure that the User is matched to their appropriate information (on the back-end).

## Event Page (back-end and front-end): Assigned to Muhammad (due by July 30th)

- Allow a User to view a list of available Events and sign up for them (in the form of Event Thumbnails).
- Update the backend and the front end dynamically to keep track of the events that the User is registered in.

## Store Page (back-end and front-end): Assigned to Yuchen (due by July 31st)

- Allow a User to view their specific store page (each user is assigned a specific instance of a page) which displays items (using icons) that they can purchase or have purchased.
- Ensure that a User is appropriately matched to their specific page and that the item list is is correctly kept track of.

## Match Page (front-end): Assigned to Muhammad (due by July 31th)

- Allow for upto four Users to interactively play a game of Uno, using button clicks.
- This entails keeping track of the Game State e.g. which player holds each card, what cards remain inside the deck, and the winner, and displaying the information to the User(s) in a Graphical Format: their avatars will be displayed, and a particluar user's hand will be rendered, and the player (whose turn it is) is indicated usingn an arrow icon next to their user-name (which is rendered in the form of a label).

## Match Page (back-end): Assigned to Muhammad (due by July 31st)

- Implement back-end NoSQL logic for keeping track of the Game State (abstracted from the front-end, for security and data integrity purposes).
- Implement the Database tables using appropriate commands and ensure that integrity constraints are upheld as outlined in the Milestone 3 document.
- Implement appropriate querying and insertion wrappers for each of the respective tables listed in the Milestone 3 document.

## Unit Testing for respective components of the application: (due by April 1st)

- Unit Tests for the Tables (their creation and querying) (Muhammmad)
- Unit Tests for the front-end page (Landing Page) (Yuchen)
- Unit Tests for the front-end page (Match Page) (Perry)

## Application Integration and Deployment: (due by April 1st)

- Concerted Effort. Assigned to all and will be done synchronously after input from Project Mentor has been received, and previous elements have been realized.

---

# Concerns/Limitations:

- Some of the Pages may not be completely realizable due to time constraints. In such a scenario, some of the pages may be pruned or some of the functionality may have to be eschewed.
- It is possible that owing to the rather compressed nature of the Timeline some of the items may have to be pushed ahead.
- Most Group members do not have sufficient experience developing a Web Application that integrates a Database.
- Group coordination is inherently hard and since we have not had sufficient time to interact with one another and discern our weaknesses and strengths it is expected that coordination may be an obstacle that should be taken into account.
- Some Group Members may find on-boarding more challenging than others and as such they may fall behind. In such a scenario it is expected that other group members will be of assistance in addition to the T.A. team.

---

# Tech Stack Changes:

- We switched from `Oracle DB` (the department DB) to `MSQL` as it supports more features and is more user-friendly.
- We get rid of the `React` front-end framework to reduce the complexity of the project.
- Because of the need to use `npm`, we finished our development on the local machine.

# Setup:

### Local Setup:

1. Requirements:

   1. `Node.js` and `npm` must be installed on your local machine. Please navigate to the relevant (downloaded) directory and use npm install (while inside the directory) to install all the relevant dependencies.
   2. `MySQL` must be installed on your local machine. Here is a brief guide on how to set it up: https://youtu.be/u96rVINbAUI?si=LSaZQrlvmomSGvhW (please be sure to set up the environment as well.) Thereafter, you will be able to run queries using our SQL script on our repository.

2. `.env` file:

   1. The `.env` file is used to store the environment variables for initializing the database connection.
   2. Please create a `.env` file in the root directory of the project with the following content with appropriate values:
      ```
      LOGIN_USERNAME = admin
      LOGIN_PASSWORD = admin123
      DATABSE_HOST = localhost
      DATABASE_USER = root
      DATABASE_PASSWORD = ?
      DATABASE = UNOGameSystem
      SESSION_SECRET = uno
      JWT_SECRET = uno
      JWT_EXPIRES_IN = 90d
      JWT_COOKIE_EXPIRES = 90
      ```

Note: for `DATABASE_PASSWORD` use the same password you set up during the MySQL installation or Configuration process on your computer.

2. Run `npm install` inside the terminal when you have navigated to this directory to install the `node_modules` directory which is required to run the application locally.

3. Use the command `npm run devStart` to start a local session of the application (which uses `localhost` and port 3001 as specified in the `server.js` file). The session will run inside the browser set as default. (You may use `npm run start`, as well.)

`Please refer to the uno.sql file, for information about the Database.`

---

# Deliverables for Milestone 4:

- Please find the Milestone document inside the repository.
- [.sql script to setup the database](./uno.sql)
