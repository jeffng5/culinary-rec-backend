const express = require('express');
const app = express();
const serverless = require('serverless-http');
const cors = require("cors");
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(cors());
app.use('/static', express.static('static'))

const db_URL = process.env.DATABASE_URL
const password = process.env.PASSWORD
const PORT = process.env.DATABASE_PORT
const USER = process.env.USER

const pgp = require('pg-promise')(/* options */)
const db = pgp(`postgres://${USER}:${password}@${db_URL}:${PORT}/template1`)

// const db = pgp(`postgresql://postgres:${process.env.PWD}@db.wfjzfjgrnbkhssvvczib.supabase.co:5432/postgres`)
console.log(db)

app.get('/home', async (req, res, next) => {

    console.log('load route hit')
    try {
        const results = await db.query(`SELECT DISTINCT recipes.id, recipes.name, image_url, images.recipe_id, COUNT(ratings.recipe_id) as divisor, sum(ratings.rating) as sumRating FROM recipes LEFT JOIN images ON images.recipe_id = recipes.id LEFT JOIN ratings ON images.recipe_id = ratings.recipe_id WHERE images.image_url IS NOT NULL GROUP BY recipes.id, recipes.name,images.image_url, images.recipe_id ORDER BY recipes.id`);
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
    console.log('TAG', tag)

    if (tag != undefined) {
        let flattenedTags = tag.flat()
        console.log('yes:', flattenedTags)
        try {
            const results = await db.query(`
            SELECT table1.name, COUNT(table1.name), table1.image_url, table1.id, table1.divisor, table1.sumrating FROM 
            
            (SELECT name, tag, recipes.id, images.image_url, COUNT(ratings.recipe_id) as divisor, sum(ratings.rating) as sumrating  
                FROM recipes 
                JOIN tags on recipes.id = tags.recipe_id 
                INNER JOIN images ON images.recipe_id = tags.recipe_id
                LEFT JOIN ratings on ratings.recipe_id = recipes.id  
                WHERE tag = $1 or tag = $2 or tag = $3 or tag = $4 or tag = $5 or tag = $6 or tag = $7 or tag = $8 or tag = $9 or tag = $10 or tag = $11 or tag = $12 or tag = $13 or tag =$14 or tag = $15 or tag = $16
                GROUP BY recipes.name, tags.tag, recipes.id, images.image_url) as table1
            GROUP BY table1.name, table1.image_url, table1.id, table1.divisor, table1.sumrating
            `, [flattenedTags[0], flattenedTags[1], flattenedTags[2], flattenedTags[3], flattenedTags[4], flattenedTags[5], flattenedTags[6], flattenedTags[7], flattenedTags[8], flattenedTags[9], flattenedTags[10], flattenedTags[11], flattenedTags[12], flattenedTags[13], flattenedTags[14], flattenedTags[15]]);
            console.log(results.sumrating/results.divisor)

            return res.send(results)
        } catch (err) {
            console.log(err)
        }
    }
    else {
        console.log('Test route')
        try {
            const fallbackResults = await db.query(`SELECT DISTINCT recipes.id, recipes.name, image_url, images.recipe_id, COUNT(ratings.recipe_id) as divisor, sum(ratings.rating) as sumRating FROM recipes LEFT JOIN images ON images.recipe_id = recipes.id LEFT JOIN ratings ON images.recipe_id = ratings.recipe_id WHERE images.image_url IS NOT NULL GROUP BY recipes.id, recipes.name, images.image_url, images.recipe_id ORDER BY recipes.id`)
            return res.send(fallbackResults)
        } catch (err) {
            console.log(err)
        }
    }
}
);

app.get('/individual-recipes', async function (req, res, next) {
    console.log('route is correct')
    const name = req.query.ids
   
    if (typeof name == "string") {
        const results = await db.query(`SELECT DISTINCT recipes.name, procedures.recipe_id, procedures.step_no, procedures.procedure, images.image_url, COUNT(ratings.recipe_id) as divisor, sum(ratings.rating) as sumRating FROM recipes LEFT JOIN procedures ON recipes.id = procedures.recipe_id LEFT JOIN images ON recipes.id = images.recipe_id LEFT JOIN ratings ON ratings.recipe_id = recipes.id WHERE recipes.name = $1 GROUP BY recipes.name, procedures.recipe_id, procedures.step_no, procedures.procedure, images.image_url ORDER BY step_no`, [name]);

        return res.send(results)

    };
})

app.get('/favorites', async function (req, res, next) {
    console.log('You hit the favorites route')

    try {
        const results = await db.query(`SELECT DISTINCT recipes.id, recipes.name, image_url, images.recipe_id, COUNT(ratings.recipe_id) as divisor, sum(ratings.rating) as sumrating FROM recipes LEFT JOIN images ON images.recipe_id = recipes.id LEFT JOIN ratings ON images.recipe_id = ratings.recipe_id WHERE images.image_url IS NOT NULL GROUP BY recipes.id, recipes.name,images.image_url, images.recipe_id HAVING sum(ratings.rating) / COUNT(ratings.recipe_id) >= 4.25 ORDER BY recipes.id`);

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

app.get('/get-all-ratings', async function (req, res, next) {
    console.log('You have hit get-ratings route and it will be computed.')

    if (req.query.id) {
    let id = req.query.id
    console.log(req.query)
    try {
        const results = await db.query('SELECT recipes.id, COUNT(recipe_id) as divisor, sum(rating) as sumRating FROM ratings JOIN recipes ON recipes.id = ratings.recipe_id WHERE recipes.id = $1 GROUP BY id', [id]);

        return res.send(results)
    } catch(err) {
        console.log(err)
        return 
    }
} else {
    return res.send('404 error')
}

})

// app.get('get-all-ratings', async function (req, res, next) {
//     try {
//         const results = await db.query(`SELECT `)
//     }
// })

module.exports = app;