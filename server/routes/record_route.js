const router = require('express').Router();

const { wrapAsync, authentication } = require('../utils/serverHelper');

const { insertRecord } = require('../controllers/record_controller');
router.route('/record').post(authentication(), wrapAsync(insertRecord));
module.exports = router;
