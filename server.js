"use strict";

const app = require("./app");
require('dotenv').config();
const PORT = process.env.EXPRESS_PORT


app.listen(PORT, () => {
  console.log(`Started on http://localhost:${PORT}`);
});