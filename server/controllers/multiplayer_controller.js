const checkRoomId = (req, res) => {
  const roomId = req.body.roomId;
  console.log(roomSet);
  return res.send('123');
};

module.exports = {
  checkRoomId,
};
