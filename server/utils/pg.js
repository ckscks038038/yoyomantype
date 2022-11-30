const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '3.113.125.224',
  database: 'yoyomantype',
  password: 'postgres',
  port: 5432,
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
