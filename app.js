const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(cors());
app.use('/static', express.static('static'))

const password = process.env.PASSWORD
const PORT = process.env.DATABASE_PORT
const USER = process.env.USER

const pgp = require('pg-promise')(/* options */)
const db = pgp(`postgres://${USER}:${password}@localhost:${PORT}/template1`)
console.log(db)

app.get('/', async (req, res, next) => {

    console.log('load route hit')
    try {
        const results = await db.query(`SELECT DISTINCT recipes.id, recipes.name, image_url, images.recipe_id, COUNT(ratings.recipe_id) as divisor, sum(ratings.rating) as sumRating FROM recipes LEFT JOIN images ON images.recipe_id = recipes.id LEFT JOIN ratings ON images.recipe_id = ratings.recipe_id GROUP BY recipes.id,recipes.name, images.image_url, images.recipe_id, ratings.rating ORDER BY recipes.id`);
        console.log(results)
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
            const results = await db.query(`WITH table1 as (SELECT images.image_url, name, tag, ratings.rating FROM recipes RIGHT JOIN tags on recipes.id = tags.recipe_id INNER JOIN images ON images.recipe_id = tags.recipe_id LEFT JOIN ratings ON ratings.recipe_id = recipes.id WHERE tag = $1 or tag = $2 or tag = $3 or tag = $4 or tag = $5 or tag = $6 or tag = $7 or tag = $8 or tag = $9 or tag = $10 or tag = $11 or tag = $12 or tag = $13 or tag =$14 or tag = $15 or tag = $16) SELECT DISTINCT(name), COUNT(name), image_url, rating from table1 GROUP BY name, image_url, table1.rating HAVING COUNT(name) >= 1`, [flattenedTags[0], flattenedTags[1], flattenedTags[2], flattenedTags[3], flattenedTags[4], flattenedTags[5], flattenedTags[6], flattenedTags[7], flattenedTags[8], flattenedTags[9], flattenedTags[10], flattenedTags[11], flattenedTags[12], flattenedTags[13], flattenedTags[14], flattenedTags[15]]);
            console.log(results)
            return res.send(results)
        } catch (err) {
            console.log(err)
        }
    }
    if (tag == undefined) {
        try {
            const fallbackResults = await db.query(`SELECT name, image_url, ratings.rating FROM recipes LEFT JOIN images ON recipes.id = images.recipe_id LEFT JOIN ratings ON ratings.recipe_id = recipes.id ORDER BY recipes.id`)
            return res.send(fallbackResults)
        } catch (err) {
            console.log(err)
        }
    }
}
);

app.get('/individual-recipes', async function (req, res, next) {

    const name = req.query.ids
    console.log('route is correct')
    if (typeof name == "string") {
        const results = await db.query(`SELECT DISTINCT recipes.name, procedures.recipe_id, procedures.step_no, procedures.procedure, images.image_url, ratings.rating FROM recipes LEFT JOIN procedures ON recipes.id = procedures.recipe_id LEFT JOIN images ON recipes.id = images.recipe_id LEFT JOIN ratings ON ratings.recipe_id = recipes.id WHERE recipes.name = $1 GROUP BY recipes.name, procedures.recipe_id, procedures.step_no, procedures.procedure, images.image_url, ratings.rating ORDER BY step_no`, [name]);

        return res.send(results)

    };
})

app.get('/favorites', async function (req, res, next) {
    console.log('You hit the favorites route')

    try {
        const results = await db.query(`SELECT recipes.name, images.image_url, images.recipe_id FROM recipes JOIN images ON images.recipe_id = recipes.id INNER JOIN favorites ON favorites.recipe_id = recipes.id ORDER BY recipes.id`);

        return res.send(results)
    } catch (err) {
        console.log(err)
    }
})

app.post('/ratings', async function (req, res, next) {
    console.log('You have hit the ratings route')
    const { ratings, id } = req.body

    console.log(req.body.id.id)
    console.log(req.body.ratings.input)
    const rate = req.body.ratings.input
    const idz = req.body.id.id
    try {
        const results = await db.query(`INSERT INTO ratings (recipe_id, rating) VALUES ($1, $2) RETURNING *`, [idz, rate]);
    } catch(err) {
        console.log(err)
    }
})

// app.get('/get-ratings', async function (req, res, next) {
//     console.log('You have hit get-ratings route and it will be computed.')

//     console.log(req.query.id)
//     const id = req.query.id
//     console.log('query_id = ', id )
//     try {
//         const results = await db.query('SELECT COUNT(recipe_id) as divisor, sum(rating) as sumRating FROM ratings WHERE recipe_id = $1 AND recipe_id IS NOT NULL AND rating IS NOT NULL GROUP BY recipe_id', [id]);

//         return res.send(results)
//     } catch(err) {
//         console.log(err)
//     }
// })

// app.get('get-all-ratings', async function (req, res, next) {
//     try {
//         const results = await db.query(`SELECT `)
//     }
// })

module.exports = app;