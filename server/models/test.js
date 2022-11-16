const pool = require('../utils/pg');

const check_email_sql = `SELECT email FROM accounts WHERE email = $1`;
const email = 'test01@test.com1';
const ac = async () => {
  const return_email = await pool.query(check_email_sql, [email]);
  console.log(return_email.rows);
};

ac();
