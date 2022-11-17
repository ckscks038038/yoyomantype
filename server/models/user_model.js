require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../utils/pg');
const salt = parseInt(process.env.BCRYPT_SALT);
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds

const signUp = async (name, email, password) => {
  //check if the email has already existed
  const check_email_sql = `SELECT email FROM accounts WHERE email = $1`;
  const return_email = await pool.query(check_email_sql, [email]);
  if (return_email.rows.length > 0) {
    return {
      error: 'Email Already Exists',
    };
  }

  //   const conn = await pool.getConnection();
  const conn = await pool.connect();
  // console.log(name, roleId, email, password);
  try {
    const user = {
      email: email,
      password: bcrypt.hashSync(password, salt),
      name: name,
    };
    const accessToken = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      TOKEN_SECRET
    );

    const queryStr =
      'INSERT INTO accounts (name, password, email,created_on, last_login) values ($1,$2,$3,current_timestamp,current_timestamp)';
    const result = await conn.query(queryStr, [
      name,
      bcrypt.hashSync(password, salt),
      email,
    ]);

    user.id = result.insertId;
    user.access_token = accessToken;

    return { user };
  } catch (error) {
    console.log(error);
    return {
      error: 'Email Already Exists',
      status: 403,
    };
  } finally {
    conn.release();
  }
};

const nativeSignIn = async (email, password) => {
  const conn = await pool.connect();
  try {
    const sql = `SELECT * FROM accounts WHERE email = $1`;
    const users = await conn.query(sql, [email]);
    const user = users.rows;

    if (!bcrypt.compareSync(password, user[0].password)) {
      await conn.query('COMMIT');
      return { error: 'wrong password', status: 401 };
    }

    const accessToken = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      TOKEN_SECRET
    );

    user.access_token = accessToken;
    user.access_expired = TOKEN_EXPIRE;

    return { user };
  } catch (error) {
    console.log(error);
    return {
      error: 'the email does not exist, please register first',
      status: 402,
    };
  } finally {
    conn.release();
  }
};

const getUserDetail = async (email) => {
  try {
    const users = await pool.query('SELECT * FROM accounts WHERE email = $1', [
      email,
    ]);

    return users.rows;
  } catch (e) {
    return null;
  }
};

module.exports = {
  signUp,
  nativeSignIn,
  getUserDetail,
};
