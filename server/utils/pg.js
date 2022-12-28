const { Pool } = require('pg');
require('dotenv').config();

const {
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} = process.env;

const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DATABASE,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT,
});

pool
  .connect()
  .then(() => {
    console.log('timescaleDB connected successfully');
  })
  .catch(() => {
    console.log('timescaleDB connection fail');
  });

module.exports = pool;
