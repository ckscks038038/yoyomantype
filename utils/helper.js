// socket.io
const findRooms = (socket) => {
  let availableRooms = [];
  var rooms = socket.rooms;
  rooms.forEach((room) => {
    if (room !== socket.id) {
      console.log('現有的room', room);
      availableRooms = [...availableRooms, room];
    }
  });
  console.log(availableRooms);
  return availableRooms;
};

module.exports = { findRooms };
