const Pool = require("pg-pool");
require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DB_PORT,
  database: "todoapp",
});

module.exports = pool;
