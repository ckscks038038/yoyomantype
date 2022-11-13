const router = require('express').Router();
const { getWords } = require('../controllers/words_controller');
const { wrapAsync } = require('../utils/serverHelper');

router.route('/words').post(wrapAsync(getWords));
module.exports = router;
