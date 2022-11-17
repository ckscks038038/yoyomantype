require('dotenv').config();
const { promisify } = require('util');
const { TOKEN_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
// error handling
const wrapAsync = (fn) => {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
};

const authentication = () => {
  return async function (req, res, next) {
    let accessToken = req.get('Authorization');

    if (!accessToken) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }

    accessToken = accessToken.replace('Bearer ', '');
    if (accessToken == 'null') {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }

    try {
      const user = await promisify(jwt.verify)(accessToken, TOKEN_SECRET);

      req.user = user;
      let [userDetail] = await User.getUserDetail(user.email);

      console.log('userDetail', userDetail);
      if (!userDetail) {
        res.status(403).send({ error: 'Forbidden' });
      } else {
        req.user.id = userDetail.id;
        req.user.role_id = userDetail.role_id;
        req.user.created_on = userDetail.created_on;
        req.user.last_login = userDetail.last_login;
        next();
      }
      return;
    } catch (err) {
      res.status(403).send({ error: 'Forbidden' });
      return;
    }
  };
};

module.exports = { wrapAsync, authentication };
