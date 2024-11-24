const { Client } = require('pg')
const { getDatabaseUri } = require("./config")
require('dotenv').config();

let db;
const PASSWORD = process.env.PASSWORD
const USER = process.env.USER
const DATABASE_PORT = process.env.DATABASE_PORT

// if (process.env.NODE_ENV === "production") {
//     db = new Client({
//       connectionString: getDatabaseUri,
    

//     });
//   } else {

    db = new Client({
      connectionString: `postgresql://${USER}:${PASSWORD}@localhost:${DATABASE_PORT}/postgres`
    });

  
  module.exports = db;