const router = require('express').Router();
const {
  getWords,
  getFuzzySearchWords,
  getQueryStringWords,
} = require('../controllers/words_controller');
const { wrapAsync } = require('../utils/serverHelper');
getQueryStringWords;
router.route('/words').post(wrapAsync(getWords));
router.route('/fuzzysearch').post(wrapAsync(getFuzzySearchWords));
router.route('/querystring').post(wrapAsync(getQueryStringWords));
module.exports = router;
