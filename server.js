"use strict";

const app = require("./app");
require('dotenv').config();
const serverless = require('serverless-http');
const PORT = process.env.EXPRESS_PORT

const handler = serverless(app);

const startServer = async () => {
    app.listen(PORT, () => {
      console.log(`listening on port http://${process.env.DATABASE_URL}:${PORT}`);
    });
}

startServer();

module.exports.handler = (event, context, callback) => {
    const response = handler(event, context, callback);
    return response;
};

