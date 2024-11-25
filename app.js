const express = require('express');
const app = express();
const cors = require("cors");
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

if (db) {
    console.log(db)
}



app.get('/', async (req, res, next) => {

    try {
        const results = await db.query(`SELECT name FROM recipes ORDER BY id`);
        return res.send(results)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: err })
    }
}
)

module.exports = app;