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

const wrapAsync = (fn) => {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
};

module.exports = { wrapAsync, findRooms };
