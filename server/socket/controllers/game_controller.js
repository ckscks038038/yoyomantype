const Room = require('../../utils/roomMap');

module.exports = (io) => {
  function startGame(roomId) {
    const socket = this;
    Room.changeStartStateToMap(roomId);
    //回傳文章給guest

    socket.emit('get article', Room.getArticleFromMap(roomId));
    //broadcast給房主修改遊戲狀態(state)
    io.to(roomId).emit('run state');
  }
  //房主改動狀態=>廣播給所有房客
  function changeGuestState({ state, roomId }) {
    io.to(roomId).emit('change guest state', state);
  }

  function finishGame({ roomId }) {
    const socket = this;
    //修改遊戲狀態=> finished
    Room.changeFinishStateToMap(roomId);
    io.to(roomId).emit('finish state');
    io.to(roomId).emit('winner', {
      winnerName: socket.name,
      winnerId: socket.id,
    });
    console.log('id.name', socket.name);
    //***重製所有人打字進度***//
    //先得到所有玩家的id
    const users = Room.getUsersProgressInMap(roomId);
    const arrOfUserId = Object.keys(users.users);

    console.log('arrOfUserId', arrOfUserId);
    //更新typed=0
    arrOfUserId.forEach((userId) => {
      Room.updateUsersProgressToMap(roomId, userId, 0);
    });
    //通知前端更新畫面
    const usersProgress = Room.getUsersProgressInMap(roomId);
    io.to(roomId).emit('send users progress', usersProgress);
  }

  function updateUsersProgress({ roomId, totalTyped }) {
    const socket = this;

    //先更新
    Room.updateUsersProgressToMap(roomId, socket.id, totalTyped);
    // console.log('目前打了多少呢', totalTyped);

    //通知前端更新畫面
    const usersProgress = Room.getUsersProgressInMap(roomId);
    io.to(roomId).emit('send users progress', usersProgress);
  }

  function getUsersProgress(roomId) {
    const usersProgress = Room.getUsersProgressInMap(roomId);
    io.to(roomId).emit('send users progress', usersProgress);
  }
  return {
    startGame,
    finishGame,
    changeGuestState,
    updateUsersProgress,
    getUsersProgress,
  };
};
