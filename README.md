# UNO GAME SYSTEM MANAGER AND USER  

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
page was assigned to a unique participant (one to many), and therefore the User Storu assigned indicate the tasks assigned, as well.

We divided the front-end (the React components) equally (in the manner above; one to many). Sifficine ttime was expended to determine viable table, which may be inquired by our TA mentor.

Yuchen, Muhammad, and Perry have an quivalent number of tables to design. This is intentionally left somewhat vague as we must confer with our mentor to reduce the amount of tables. But at present, the division is such that equity of particiaption is maintained.
We also divided the front-end (the React components) equally (in the manner above; one to many).

---

# Timeline 

## Landing Page (front-end) (User Login): Assigned to Yuchen (due by July 29th) 

- Allow for a User to login using their credentials. 
- Ensure that a User is redirected to a page that renders information appropriate to them i.e. their characters, items, inventories et cetera. 

## Match Page (front-end): Assigned to Muhammad (due by July 29th) 

- Allow for upto four Users to interactively play a game of Uno. 
- This entails keeping track of the Game State e.g. which player holds each card, what cards remain inside the deck, and the winner. 


## Landing Page (back-end): Assigned to Perry (due by July 29th) 

- Implement back-end NoSQL logic for keeping track of all the players who are part of the application. 
- Implement the Database tables using appropriate commands and ensure that integrity constraints are upheld. 
- Implement appropriate querying and insertion for the respective users for login. 

## Match Page (back-end): (due by July 29th) 

- Implement back-end NoSQL logic for keeping track of the Game State (abstracted from the front-end, for security and data integrity purposes). (Assigned to Yuchen)
- Implement the Database tables using appropriate commands and ensure that integrity constraints are upheld as outlined in the Milestone 3 document. (Assigned to Muhammad)
- Implement appropriate querying and insertion wrappers for each of the respective tables listed in the Milestone 3 document. (Assigned to Perry)

## Unit Testing for respective components of the application: (due by July 30th) 
 
- Unit Tests for the Tables (their creation and querying) (Muhammmad) 
- Unit Tests for the front-end page (Landing Page) (Yuchen)
- Unit Tests for the front-end page (Match Page) (Perry) 

## Application Integration and Deployment: (due by July 31st)

- Concerted Effort. Assigned to all and will be done synchronously after input from Project Mentor has been received. 

---



    










