require('dotenv').config();
const bcrypt = require('bcrypt');
const got = require('got');
const { pool } = require('./mysqlcon');
const salt = parseInt(process.env.BCRYPT_SALT);
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const USER_ROLE = {
    ALL: -1,
    ADMIN: 1,
    USER: 2,
};

const signUp = async (name, roleId, email, password) => {
    //check if the email has already existed
    const check_email_sql = `SELECT email FROM user WHERE email = ?`;
    const [return_email] = await pool.execute(check_email_sql, [email]);
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
            title: "會員抱抱",
            image: "https://yoyoman.site/images/member.png",
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

        const [users] = await conn.query('SELECT * FROM user WHERE email = ?', [email]);
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

        const queryStr = 'UPDATE user SET access_token = ?, access_expired = ?, login_at = ? WHERE id = ?';
        await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, user.id]);

        await conn.query('COMMIT');

        user.access_token = accessToken;
        user.login_at = loginAt;
        user.access_expired = TOKEN_EXPIRE;

        return { user };
    } catch (error) {
        await conn.query('ROLLBACK');
        return { error: 'the email does not exist, please register first', status: 402 };
    } finally {
        await conn.release();
    }
};

const facebookSignIn = async (id, roleId, name, email) => {
    const conn = await pool.getConnection();
    try {
        const loginAt = new Date();
        let user = {
            provider: 'facebook',
            role_id: roleId,
            email: email,
            name: name,
            picture: 'https://graph.facebook.com/' + id + '/picture?type=large',
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

        const [users] = await conn.query("SELECT id FROM user WHERE email = ? AND provider = 'facebook'", [email]);
        let userId;
        if (users.length === 0) {
            // Insert new user
            const queryStr = 'insert into user set ?';
            const [result] = await conn.query(queryStr, user);
            userId = result.insertId;

            // 會員首次註冊通知
            const register = {
                type: 3,
                title: "會員抱抱",
                image: 'https://graph.facebook.com/' + id + '/picture?type=large',
                user_id: result.insertId,
                read_status: 0, // 0 是未讀，1 是已讀
                order_status: 1,
                time: Date.now(),
                content: `您好！歡迎您成為 STYLiSH 時尚穿搭網路商店會員！感謝您對 STYLiSH 的支持！歡迎查看會員註冊/驗證成功通知郵件領取「新平台滿額首購金」，謝謝您！`,
            };
            const notifyQueryStr = 'INSERT INTO notification SET ?';
            const [notifyResult] = await conn.query(notifyQueryStr, register);
        } else {
            // Update existed user
            userId = users[0].id;
            const queryStr = 'UPDATE user SET access_token = ?, access_expired = ?, login_at = ?  WHERE id = ?';
            await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, userId]);
        }
        user.id = userId;
        return { user };
    } catch (error) {
        return { error };
    } finally {
        await conn.release();
    }
};

const googleSignIn = async (roleId, name, email, picture) => {
    const conn = await pool.getConnection();
    try {
        const loginAt = new Date();
        let user = {
            provider: 'google',
            role_id: roleId,
            email: email,
            name: name,
            picture: picture,
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
        user.access_token = accessToken; // 把新創的 jwt_token 加入 user object

        const [users] = await conn.query("SELECT id FROM user WHERE email = ? AND provider = 'google'", [email]);
        let userId;
        if (users.length === 0) {
            // Insert new user
            const queryStr = 'insert into user set ?';
            const [result] = await conn.query(queryStr, user);
            userId = result.insertId;

            // 會員首次註冊通知
            const register = {
                type: 3,
                title: "會員抱抱",
                image: picture,
                user_id: result.insertId,
                read_status: 0, // 0 是未讀，1 是已讀
                order_status: 1,
                time: Date.now(),
                content: `您好！歡迎您成為 STYLiSH 時尚穿搭網路商店會員！感謝您對 STYLiSH 的支持！歡迎查看會員註冊/驗證成功通知郵件領取「新平台滿額首購金」，謝謝您！`,
            };
            const notifyQueryStr = 'INSERT INTO notification SET ?';

            const [notifyResult] = await conn.query(notifyQueryStr, register);
        } else {
            // Update existed user
            userId = users[0].id;
            const queryStr = 'UPDATE user SET access_token = ?, access_expired = ?, login_at = ?  WHERE id = ?';
            await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, userId]);
        }
        user.id = userId;
        return { user };
    } catch (error) {
        return { error };
    } finally {
        await conn.release();
    }
};

const firebaseSignIn = async (roleId, name, email, picture) => {
    const conn = await pool.getConnection();
    try {
        const loginAt = new Date();
        let user = {
            provider: 'firebase',
            role_id: roleId,
            email: email,
            name: name,
            picture: picture,
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
        user.access_token = accessToken; // 把新創的 jwt_token 加入 user object

        const [users] = await conn.query("SELECT id FROM user WHERE email = ? AND provider = 'firebase'", [email]);
        let userId;
        if (users.length === 0) {
            // Insert new user
            const queryStr = 'insert into user set ?';
            const [result] = await conn.query(queryStr, user);
            userId = result.insertId;
        } else {
            // Update existed user
            userId = users[0].id;
            const queryStr = 'UPDATE user SET access_token = ?, access_expired = ?, login_at = ?  WHERE id = ?';
            await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, userId]);
        }
        user.id = userId;
        return { user };
    } catch (error) {
        return { error };
    } finally {
        await conn.release();
    }
};

const getUserDetail = async (email, roleId) => {
    try {
        if (roleId) {
            const [users] = await pool.query('SELECT * FROM user WHERE email = ? AND role_id = ?', [email, roleId]);
            return users[0];
        } else {
            const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
            return users[0];
        }
    } catch (e) {
        return null;
    }
};

const getFacebookProfile = async function (accessToken) {
    try {
        let res = await got('https://graph.facebook.com/me?fields=id,name,email&access_token=' + accessToken, {
            responseType: 'json',
        });
        return res.body;
    } catch (e) {
        console.log(e);
        throw 'Permissions Error: facebook access token is wrong';
    }
};

const getGoogleProfile = async function (accessToken, clientID) {
    try {
        // 送去 google 認證 token
        const client = new OAuth2Client(clientID);
        const res = await client.verifyIdToken({
            idToken: accessToken,
            audience: clientID,
        });
        // console.log('res: ', res);
        return res.payload;
    } catch (e) {
        console.log(e);
        throw 'Permissions Error: google access token is wrong';
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
    getFacebookProfile,
    getGoogleProfile,
};
