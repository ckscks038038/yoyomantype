const router = require('express').Router();
const {
  getWords,
  getsimilarWords,
} = require('../controllers/words_controller');
const { wrapAsync } = require('../utils/serverHelper');

router.route('/words').post(wrapAsync(getWords));
router.route('/espractice').get(wrapAsync(getsimilarWords));

module.exports = router;
