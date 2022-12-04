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

    const queryStr =
      'INSERT INTO accounts (name, password, email,created_on, last_login) values ($1,$2,$3,current_timestamp,current_timestamp) RETURNING id';
    const result = await conn.query(queryStr, [
      name,
      bcrypt.hashSync(password, salt),
      email,
    ]);

    // signUp後的 user_id
    user.id = result.rows[0].id;

    const accessToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      TOKEN_SECRET
    );
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
      { id: [0].id, name: user[0].name, email: user[0].email },
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

const getUserTyingData = async (id) => {
  //typingData: 由物件{acc, cpm, accounts_id}組成的陣列
  const typingData = await pool.query(
    'SELECT acc, cpm, date FROM history_time where accounts_id = $1',
    [id]
  );
  // console.log('typingData', typingData.rows);

  return typingData.rows;
};

const updateLeaderboard = async () => {
  //取得目前排行榜的值
  //比對前五名是否需要更新
  //if true, 更新資料庫
};
module.exports = {
  signUp,
  nativeSignIn,
  getUserDetail,
  getUserTyingData,
};
