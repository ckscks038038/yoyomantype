const { Pool, Client } = require('pg');

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
    console.log('Database connected successfully');
  })
  .catch(() => {
    console.log('Database connection fail');
  });

module.exports = pool;
