const express = require('express')
const app = express();
const cors = require("cors")
const { ExpressError } = require('./expressError');
const { NotFoundError } = require("./expressError");
require('dotenv').config();
const bodyParser = require('body-parser')

app.use(express.json)
app.use(bodyParser.json())
app.use(cors());

const handleCors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
   };
app.use(handleCors)

const password = process.env.PASSWORD
const PORT = process.env.DATABASE_PORT
const USER = process.env.USER

// const pgp = require('pg-promise')
// const db = pgp(`postgres://${USER}:${password}@127.0.0.1:${PORT}/template1`)
const db = require('./db.js')

async () => { await console.log(db.connect())
}


app.get('/', async (req, res, next) => {

    try {
        const results = await db.query(`SELECT name FROM recipes`);
        console.log(res.status(200).json(results.rows))
        const name = results.rows
        let allRecipes = []
        allRecipes.push(results)
        res.json({message: 'Hello World'})
        
    }
 catch(err) {
    console.log(err)
    return res.status(500).json({error : err})
 }
}
)

module.exports = app;