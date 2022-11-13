const router = require('express').Router();
const { checkRoomId } = require('../controllers/multiplayer_controller');

router.route('/room').post(checkRoomId);
module.exports = router;
