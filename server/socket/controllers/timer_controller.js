module.exports = (io) => {
  function resetCountdown(roomId) {
    io.to(roomId).emit('resetCountdown');
  }

  function startCountdown(roomId) {
    io.to(roomId).emit('startCountdown');
  }
  return { resetCountdown, startCountdown };
};
