const router = require('express').Router();
const {
  getWords,
  getFuzzySearchWords,
} = require('../controllers/words_controller');
const { wrapAsync } = require('../utils/serverHelper');

router.route('/words').post(wrapAsync(getWords));
router.route('/espractice').get(wrapAsync(getFuzzySearchWords));

module.exports = router;
