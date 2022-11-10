const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '3.113.125.224',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

pool
  .connect()
  .then(() => {
    console.log('connected successfully');
  })
  .catch(() => {
    console.log('connection fail');
  });

module.exports = pool;
