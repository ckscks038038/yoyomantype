require('dotenv').config();
const validator = require('validator');
const User = require('../models/user_model');

const signUp = async (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*')
  let { name } = req.body;
  const { email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).send({
      error: 'Request Error: name, email and password are required.',
      status: 400,
    });
    return;
  }

  if (!validator.isEmail(email)) {
    res
      .status(400)
      .send({ error: 'Request Error: Invalid email format', status: 400 });
    return;
  }

  name = validator.escape(name);

  const result = await User.signUp(name, email, password);
  if (result.error) {
    res.status(403).send({ error: result.error, status: 403 });
    return;
  }

  const user = result.user;
  if (!user) {
    res.status(500).send({ error: 'Database Query Error', status: 500 });
    return;
  }

  res.status(200).send({
    data: {
      access_token: user.access_token,
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
};

const nativeSignIn = async (email, password) => {
  if (!email || !password) {
    return {
      error: 'Request Error: email and password are required.',
      status: 400,
    };
  }

  try {
    return await User.nativeSignIn(email, password);
  } catch (error) {
    return { error, status: 402 };
  }
};

const signIn = async (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*')
  const data = req.body;

  let result;
  switch (data.provider) {
    case 'native': // 原生登入
      result = await nativeSignIn(data.email, data.password);
      break;
    case 'facebook': // fb登入
      result = await facebookSignIn(data.access_token);
      break;
    case 'google': // google登入
      result = await googleSignIn(data.access_token, data.clientID);
      break;
    case 'firebase': // google登入
      result = await firebaseSignIn(data.name, data.email, data.picture);
      break;
    default:
      result = { error: 'Wrong Request' };
  }

  if (result.error) {
    const status_code = result.status ? result.status : 403;
    res.status(status_code).send({ error: result.error });
    return;
  }

  const user = result.user;
  if (!user) {
    res.status(500).send({ error: 'Database Query Error' });
    return;
  }

  res.status(200).send({
    data: {
      access_token: user.access_token,
      access_expired: user.access_expired,
      login_at: user.login_at,
      user: {
        id: user.id,
        provider: user.provider,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    },
  });
};

const getUserProfile = async (req, res) => {
  res.status(200).send({
    data: {
      provider: req.user.provider,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.picture,
    },
  });
  return;
};

module.exports = {
  signUp,
  signIn,
  getUserProfile,
};
