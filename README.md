# UNO Game Database Management System
## Introduction:
This program is a database management system for the UNO card game. The system is designed to store information about the players, games, and cards. The system is designed to be user-friendly and easy to use.    
The system provides features such as:
- Player registration and information management
- Game creation and management including logging the game history
- Card management. 
- Game shopping and inventory management
  
A well-designed front-end interface is provided to interact with the backend MySQL database using Node.js and Express.js
## Setup:

1. Requirements:

   1. `Node.js` and `npm` must be installed on your local machine. 
   2. `MySQL` must be installed on your local machine with a user account and password set up.

2. `.env` file:

   1. The `.env` file is used to store the environment variables for initializing the database connection.
   2. Please create a `.env` file in the root directory of the project with the following content with appropriate values:
      ```
      LOGIN_USERNAME=admin
      LOGIN_PASSWORD=admin123
      DATABASE_HOST=db
      DATABASE_USER=root
      DATABASE_PASSWORD=password
      DATABASE=UNOGameSystem
      SESSION_SECRET=uno
      JWT_SECRET=uno
      JWT_EXPIRES_IN=90d
      JWT_COOKIE_EXPIRES=90
      ```

Note: for `DATABASE_PASSWORD` use the same password you set up during the MySQL installation or Configuration process on your computer.

1. Run `npm install` inside the terminal when you have navigated to this directory to install the `node_modules` directory which is required to run the application locally.

2. Use the command `npm run devStart` to start a local session of the application (which uses `localhost` and port 3001 as specified in the `server.js` file). The session will run inside the browser set as default. (You may use `npm run start`, as well.)

`Please refer to the uno.sql file, for information about the Database.`

## Setup with Docker:
The `Dockerfile` and `compose.yaml` files are provided to run the application in a Docker container. 
After you've set up the `.env` file, run `docker compose up` to start the application in a Docker container. The application will be available at `localhost:3000`.

## Database Schema:
A ER diagram of the database schema is available [here](./ER_Diagram.jpg).
The database schema is normalized to BCNF and is designed to store information about the players, games, and cards. The database schema consists of the following tables:

## Project Structure:
The project is structured as follows:
- `public` directory contains the front-end utilities such as CSS, JavaScript, and icons.
- `views` directory contains the front-end `ejs` templates.
- `routes` directory handles the request routing and response handling, and authentication.
- `models` directory contains the database models and queries.
- `controllers` directory links the routes and models.
- `config` directory contains codes for setting up the database connection and client session.
- `uno.sql` file contains the SQL code to initialize the database schema.
- `server.js` file is the entry point of the application that sets up the server. 

## Credits:
Thanks for Yuchen Gu and Daud Virk for their contributions to this project.   
The project was inspired by UBC's CPSC 304 course project.