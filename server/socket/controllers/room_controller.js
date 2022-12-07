const Room = require('../../utils/roomMap');

function createRoom(roomId) {
  const socket = this;

  Room.createNewRoomToMap({
    roomId: roomId,
    ownerId: socket.id,
    socket: socket,
  });
  socket.join(roomId);
}
function checkRoom(roomId) {
  const socket = this;
  if (Room.checkRoomIdExistInMap(roomId)) {
    console.log(`檢查結果:存在${roomId}`);
    socket.emit('join auth', { auth: true });
  } else {
    console.log(`檢查結果:不存在roomId ${roomId}`);
    socket.emit('join auth', { auth: false });
  }
}
function joinRoom(roomId) {
  const socket = this;
  if (Room.checkRoomIdExistInMap(roomId)) {
    socket.join(roomId);
    Room.JoinRoomToMap({
      roomId: roomId,
      userId: socket.id,
      socket: socket,
    });

    //回傳文章給guest
    socket.emit('get article', Room.getArticleFromMap(roomId));
  } else {
    console.log(`不存在roomId ${roomId}`);
  }
}
module.exports = { createRoom, checkRoom, joinRoom };
