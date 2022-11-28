const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });
require('dotenv').config();
const { PORT, API_VERSION } = process.env;
const port = PORT;
const {
  JoinRoomToMap,
  createNewRoomToMap,
  checkRoomIdExistInMap,
  saveArticleToMap,
  getArticleFromMap,
  changeStartStateToMap,
  changeFinishStateToMap,
  getUsersProgressInMap,
  updateUsersProgressToMap,
  removeUserFromRoomInMap,
  findUserInRoomInMap,
} = require('./server/utils/roomMap');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/' + API_VERSION, [
  require('./server/routes/words_route'),
  require('./server/routes/multiplayer_route'),
  require('./server/routes/user_route'),
  require('./server/routes/record_route'),
]);

// socket io
io.on('connection', (socket) => {
  //創建新房間
  socket.on('create room', (roomId) => {
    createNewRoomToMap({ roomId: roomId, ownerId: socket.id, socket: socket });
    socket.join(roomId);
  });

  //確認存在房間
  socket.on('check room', (roomId) => {
    if (checkRoomIdExistInMap(roomId)) {
      console.log(`檢查結果:存在${roomId}`);
      socket.emit('join auth', { auth: true });
    } else {
      console.log(`檢查結果:不存在roomId ${roomId}`);
      socket.emit('join auth', { auth: false });
    }
  });

  //加入房間
  socket.on('join room', (roomId) => {
    if (checkRoomIdExistInMap(roomId)) {
      socket.join(roomId);
      JoinRoomToMap({ roomId: roomId, userId: socket.id, socket: socket });

      //回傳文章給guest
      socket.emit('get article', getArticleFromMap(roomId));
    } else {
      console.log(`不存在roomId ${roomId}`);
    }
  });

  //開始遊戲
  socket.on('start game', (roomId) => {
    changeStartStateToMap(roomId);
    //回傳文章給guest

    socket.emit('get article', getArticleFromMap(roomId));
    //broadcast給房主修改遊戲狀態(state)
    io.to(roomId).emit('run state');
  });

  //房主改動狀態=>廣播給所有房客
  socket.on('change guest state', ({ state, roomId }) => {
    io.to(roomId).emit('change guest state', state);
  });

  //結束遊戲
  socket.on('finish game', ({ roomId }) => {
    //修改遊戲狀態=> finished
    changeFinishStateToMap(roomId);
    io.to(roomId).emit('finish state');
    io.to(roomId).emit('winner', {
      winnerName: socket.name,
      winnerId: socket.id,
    });
    console.log('id.name', socket.name);
    //***重製所有人打字進度***//
    //先得到所有玩家的id
    const users = getUsersProgressInMap(roomId);
    const arrOfUserId = Object.keys(users.users);

    console.log('arrOfUserId', arrOfUserId);
    //更新typed=0
    arrOfUserId.forEach((userId) => {
      updateUsersProgressToMap(roomId, userId, 0);
    });
    //通知前端更新畫面
    const usersProgress = getUsersProgressInMap(roomId);
    io.to(roomId).emit('send users progress', usersProgress);
  });

  //儲存文章
  socket.on('save article', ({ roomId, words }) => {
    saveArticleToMap(roomId, words);
  });

  //通知房客更新文章
  socket.on('update article', (roomId) => {
    io.to(roomId).emit('get article', getArticleFromMap(roomId));
  });

  //取得所有房客的名字、狀態
  socket.on('get users progress', (roomId) => {
    const usersProgress = getUsersProgressInMap(roomId);
    io.to(roomId).emit('send users progress', usersProgress);
  });

  //更新房客打字狀態 (totalTyped)
  socket.on('update users progress', ({ roomId, totalTyped }) => {
    //先更新
    updateUsersProgressToMap(roomId, socket.id, totalTyped);
    // console.log('目前打了多少呢', totalTyped);

    //通知前端更新畫面
    const usersProgress = getUsersProgressInMap(roomId);
    io.to(roomId).emit('send users progress', usersProgress);
  });

  //更新房客倒數狀態
  socket.on('resetCountdown', (roomId) => {
    io.to(roomId).emit('resetCountdown');
  });

  socket.on('startCountdown', (roomId) => {
    io.to(roomId).emit('startCountdown');
  });

  // 當使用者斷線，要做leave room 動作
  socket.on('disconnect', () => {
    //找到使用者在哪一間rooms
    const roomId = findUserInRoomInMap(socket.id);

    //將使用者從roomMap紀錄移除
    if (roomId) {
      removeUserFromRoomInMap(roomId, socket.id);
    }

    //通知前端更新畫面
    const usersProgress = getUsersProgressInMap(roomId);
    io.to(roomId).emit('send users progress', usersProgress);
  });
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
