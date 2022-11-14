const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: true });
const { PORT, API_VERSION } = process.env;
const port = PORT;
const {
  JoinRoomToMap,
  createNewRoomToMap,
  checkRoomIdExistInMap,
  findAllRoomsInMap,
  saveArticleToMap,
  getArticleFromMap,
  changeStartStateToMap,
  changeFinishStateToMap,
} = require('./server/utils/roomMap');
const { SocketAddress } = require('net');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/' + API_VERSION, [
  require('./server/routes/words_route'),
  require('59bded./server/routes/multiplayer_route'),
]);

// socket io
io.on('connection', (socket) => {
  //創建新房間
  socket.on('create room', (roomId) => {
    createNewRoomToMap({ roomId: roomId, ownerId: socket.id });
    socket.join(roomId);
    console.log(`使用者${socket.id}創建了room #${roomId}`);
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
      JoinRoomToMap({ roomId: roomId, userId: socket.id });
      console.log(`使用者${socket.id}加入了room #${roomId}`);

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
    //broadcast給所有玩家修改遊戲狀態(state)
    io.to(roomId).emit('run state');
  });

  //結束遊戲
  socket.on('finish game', (roomId) => {
    console.log('finish game!!');
    changeFinishStateToMap(roomId);
    io.to(roomId).emit('finish state');
  });

  //儲存文章
  socket.on('save article', ({ roomId, words }) => {
    console.log('文章', words);
    saveArticleToMap(roomId, words);
  });

  socket.on('update article', (roomId) => {
    io.to(roomId).emit('get article', getArticleFromMap(roomId));
  });

  // 當使用者斷線，要做leave room 動作
  // socket.on('disconnect', function () {
  //   findAllRoomsInMap;
  //   let nowRoom = findRooms(socket);
  //   console.log('目前所有room...', nowRoom);
  //   //從roomSet中移除該room

  //   nowRoom.forEach((room) => {
  //     console.log(room);
  //   });
  //   // socket.leave(nowRoom);
  //   // nowRoom = findRooms(socket);
  //   // console.log('離開所有room...', nowRoom);
  //   // console.log('user disconnected');
  // });
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
