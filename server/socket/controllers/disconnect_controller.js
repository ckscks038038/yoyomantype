const Room = require('../../utils/roomMap');

module.exports = (io) => {
  function disconnect() {
    const socket = this;

    //找到使用者在哪一間rooms
    const roomId = Room.findUserInRoomInMap(socket.id);

    //將使用者從roomMap紀錄移除
    if (roomId) {
      Room.removeUserFromRoomInMap(roomId, socket.id);
    }

    //通知前端更新畫面
    const usersProgress = Room.getUsersProgressInMap(roomId);
    io.to(roomId).emit('send users progress', usersProgress);
  }

  return { disconnect };
};
