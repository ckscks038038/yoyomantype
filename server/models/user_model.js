require('dotenv').config();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const pool = require('../utils/pg');
const salt = parseInt(process.env.BCRYPT_SALT);
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds

const getWords = async (wordsNum) => {
  try {
    const query = `
	SELECT text FROM words
    ORDER BY RANDOM()
    LIMIT ${wordsNum}
`;
    const ans = await db.query(query);
    return ans.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

const signUp = async (name, email, password) => {
  //check if the email has already existed
  const check_email_sql = `SELECT email FROM accounts WHERE email = ?`;
  const [return_email] = await pool.query(check_email_sql, [email]);
  if (return_email.length > 0) {
    return {
      error: 'Email Already Exists',
    };
  }

  const conn = await pool.getConnection();
  // console.log(name, roleId, email, password);
  try {
    const loginAt = new Date();
    console.log(loginAt);
    const user = {
      provider: 'native',
      role_id: roleId,
      email: email,
      password: bcrypt.hashSync(password, salt),
      name: name,
      picture: null,
      access_expired: TOKEN_EXPIRE,
      login_at: loginAt,
    };
    const accessToken = jwt.sign(
      {
        provider: user.provider,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      TOKEN_SECRET
    );
    user.access_token = accessToken;

    const queryStr = 'INSERT INTO user SET ?';
    const [result] = await conn.query(queryStr, user);
    user.id = result.insertId;

    // 註冊同時，寫入通知 table
    const register = {
      type: 3,
      title: '會員抱抱',
      image: 'https://yoyoman.site/images/member.png',
      user_id: result.insertId,
      read_status: 0, // 0 是未讀，1 是已讀
      order_status: 1,
      time: Date.now(),
      content: `您好！歡迎您成為 STYLiSH 時尚穿搭網路商店會員！感謝您對 STYLiSH 的支持！歡迎查看會員註冊/驗證成功通知郵件領取「新平台滿額首購金」，謝謝您！`,
    };
    const notifyQueryStr = 'INSERT INTO notification SET ?';
    const [notifyResult] = await conn.query(notifyQueryStr, register);
    // console.log("notification");
    // console.log(notifyResult);

    return { user };
  } catch (error) {
    return {
      error: 'Email Already Exists',
      status: 403,
    };
  } finally {
    await conn.release();
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
  USER_ROLE,
  signUp,
  nativeSignIn,
  facebookSignIn,
  googleSignIn,
  firebaseSignIn,
  getUserDetail,
};
