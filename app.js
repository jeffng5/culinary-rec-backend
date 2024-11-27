const express = require('express');
const app = express();
const cors = require("cors");
const { ExpressError } = require('./expressError');
const { NotFoundError } = require("./expressError");
require('dotenv').config();
const bodyParser = require('body-parser');

// app.use(express.json)
// app.use(bodyParser.json())
app.use(cors());

const password = process.env.PASSWORD
const PORT = process.env.DATABASE_PORT
const USER = process.env.USER

const pgp = require('pg-promise')(/* options */)
const db = pgp(`postgres://${USER}:${password}@localhost:${PORT}/postgres`)
console.log(db)

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

app.get('/tags', async function (req, res, next) {
  
    console.log('route is hit!')
   
    console.log(req.query)
    try {
        const tag = req.query.id;
        console.log(req.query.id)

        // const ans = data.id
        console.log(tag)
        const results = await db.query(`SELECT name FROM recipes JOIN tags on recipes.id = tags.recipe_id WHERE tag = $1`, [tag]);
        console.log(results)
        return res.json(results)
    } catch (err) {
        return console.log(err)

    }

})

module.exports = app;