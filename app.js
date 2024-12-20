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
const db = pgp(`postgres://${USER}:${password}@localhost:${PORT}/template1`)
console.log(db)

app.get('/', async (req, res, next) => {

    console.log('load route hit')
    try {
        const results = await db.query(`SELECT name, image_url, images.recipe_id FROM recipes RIGHT JOIN images ON images.recipe_id = recipes.id ORDER BY recipes.id`);
        console.log(results)
        // image_url FROM recipes INNER JOIN images ON images.recipe_id = recipes.id ORDER BY recipes.id` );
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

    if (tag != undefined) {
        let flattenedTags = tag.flat()
        console.log('yes:', flattenedTags)
        try {
            const results = await db.query(`SELECT DISTINCT(name), tag FROM recipes JOIN tags on recipes.id = tags.recipe_id WHERE tag = $1 or tag = $2 or tag = $3 or tag = $4 or tag = $5 or tag = $6 or tag = $7 or tag = $8 or tag = $9 or tag = $10 or tag = $11 or tag = $12 or tag = $13 or tag =$14 or tag = $15 or tag = $16 ORDER BY tag`, [flattenedTags[0], flattenedTags[1], flattenedTags[2], flattenedTags[3], flattenedTags[4], flattenedTags[5], flattenedTags[6], flattenedTags[7], flattenedTags[8], flattenedTags[9], flattenedTags[10], flattenedTags[11], flattenedTags[12], flattenedTags[13], flattenedTags[14], flattenedTags[15]]);
            console.log(results)
            return res.send(results)
        } catch (err) {
            console.log(err)
        }
    }
    if (tag == undefined) {
        try {
            const fallbackResults = await db.query(`SELECT name FROM recipes ORDER BY id`)
            return res.send(fallbackResults)
        } catch (err) {
            console.log(err)
        }
    }
}
);

app.get('/individual-recipes', async function (req, res) {

    console.log('route is correct')
    const name = req.query.ids
    console.log(name)

    try {
        const results = await db.query(`SELECT recipes.name, procedures.recipe_id, step_no, procedure FROM recipes JOIN procedures ON recipes.id = procedures.recipe_id WHERE recipes.name = $1`, [name]);

        console.log('IT WORKS?', results)
        return res.send(results)
    } catch (err){
        console.error(err)
    }
    
})


module.exports = app;