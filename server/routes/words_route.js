const router = require('express').Router();

const { wrapAsync } = require('../util/helper');
router.route('/words').get(wrapAsync(getWords));
module.exports = router;
