const express = require('express');
const app = express();
const cors = require("cors");
const http = require('http');
const { ExpressError } = require('./expressError');
const { NotFoundError } = require("./expressError");
require('dotenv').config();
const bodyParser = require('body-parser');

// app.use(express.json)
app.use(bodyParser.json())
app.use(cors());

const password = process.env.PASSWORD
const PORT = process.env.DATABASE_PORT
const USER = process.env.USER

const pgp = require('pg-promise')(/* options */)
const db = pgp(`postgres://${USER}:${password}@localhost:${PORT}/postgres`)
// const db = require('./db.js')
if (db) {
    console.log(db)
}
// db.connect()


app.get('/', async (req, res, next) => {

    try {
        const results = await db.query(`SELECT name FROM recipes`);
       
        const name = results.rows
     
        return res.send(results)
        
    }
 catch(err) {
    console.log(err)
    return res.status(500).json({error : err})
 }
}
)

module.exports = app;