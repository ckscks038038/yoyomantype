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
  result = await nativeSignIn(data.email, data.password);
  console.log(result);

  if (result.error) {
    const status_code = result.status ? result.status : 403;
    res.status(status_code).send({ error: result.error });
    return;
  }
  const user = result.user;
  console.log('controller', user[0]);
  if (!user) {
    res.status(500).send({ error: 'Database Query Error' });
    return;
  }

  res.status(200).send({
    data: {
      access_token: user.access_token,
      user: {
        name: user[0].name,
        email: user[0].email,
      },
    },
  });
};

const getUserProfile = async (req, res) => {
  const arrOfTyingData = await User.getUserTyingData(req.user.id);
  const initialValue = 0;
  const sumOfAcc = arrOfTyingData.reduce(
    (accumulator, currentValue) => accumulator + currentValue.acc,
    initialValue
  );
  const sumOfCpm = arrOfTyingData.reduce(
    (accumulator, currentValue) => accumulator + currentValue.cpm,
    initialValue
  );
  const averageAcc = sumOfAcc / arrOfTyingData.length;
  const averageCpm = sumOfCpm / arrOfTyingData.length;
  res.status(200).send({
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      created_on: req.user.created_on,
      last_login: req.user.last_login,
      totalTest: arrOfTyingData.length,
      acc: averageAcc,
      cpm: averageCpm,
      typingData: arrOfTyingData,
    },
  });

  return;
};

module.exports = {
  signUp,
  signIn,
  getUserProfile,
};
