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
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');

    const [users] = await conn.query('SELECT * FROM user WHERE email = ?', [
      email,
    ]);
    const user = users[0];

    if (!bcrypt.compareSync(password, user.password)) {
      await conn.query('COMMIT');
      return { error: 'wrong password', status: 401 };
    }

    const loginAt = new Date();
    const accessToken = jwt.sign(
      {
        provider: user.provider,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      TOKEN_SECRET
    );

    const queryStr =
      'UPDATE user SET access_token = ?, access_expired = ?, login_at = ? WHERE id = ?';
    await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, user.id]);

    await conn.query('COMMIT');

    user.access_token = accessToken;
    user.login_at = loginAt;
    user.access_expired = TOKEN_EXPIRE;

    return { user };
  } catch (error) {
    await conn.query('ROLLBACK');
    return {
      error: 'the email does not exist, please register first',
      status: 402,
    };
  } finally {
    await conn.release();
  }
};

const getUserDetail = async (email, roleId) => {
  try {
    if (roleId) {
      const [users] = await pool.query(
        'SELECT * FROM user WHERE email = ? AND role_id = ?',
        [email, roleId]
      );
      return users[0];
    } else {
      const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [
        email,
      ]);
      return users[0];
    }
  } catch (e) {
    return null;
  }
};

module.exports = {
  signUp,
  nativeSignIn,
  getUserDetail,
};
