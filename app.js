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
        const results = await db.query(`SELECT * FROM recipes ORDER BY id`);
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
   
    const tag = req.query.ids;
    console.log(tag)
    // let tag0 = tag[0]
    // console.log('tag0', tag0)
    // let tag1 = tag[1]
    // console.log('tag1', tag1)
    // let tag2 = tag[2]
    // console.log('tag2', tag2)

    // console.log(tag2)
    // console.log('current Tag: ', tag[0], tag[1], tag[2])

 
        try {
        const results = await db.query(`SELECT DISTINCT(name) FROM recipes JOIN tags on recipes.id = tags.recipe_id WHERE tag = $1`, [tag]);
        console.log(results)
        return res.send(results)
        }catch(err){
            console.log(err)
        }

    
    }
    

);

module.exports = app;