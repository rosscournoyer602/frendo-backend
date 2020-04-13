const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT
  // connectionString: process.env.DATABASE_URL,
  // ssl: true
});

module.exports = pool;
