const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { findRooms } = require('./utils/helper');
const io = new Server(server, { cors: true });
const { PORT, API_VERSION } = process.env;
const port = PORT;
const db = require('./utils/pg');
const roomSet = new Set();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
// app.use('/api/' + API_VERSION, [require('./server/routes/words_route')]);

app.get('/', async (req, res) => {
  try {
    const query = `
CREATE TABLE users (
    email varchar,
    firstName varchar,
    lastName varchar,
    age int
);
`;
    const ans = await db.query(query);
    return res.json(ans.rows);
  } catch (err) {
    console.log(err.stack);
  }
});

app.post('/todos', async (req, res) => {
  try {
    console.log(req.body);
  } catch (err) {
    console.log(err);
  }
});

// socket io
io.on('connection', (socket) => {
  //紀錄當前的rooms

  //監聽透過 connection 傳進來的事件
  socket.on('getMessage', (message) => {
    //回傳 message 給發送訊息的 Client
    socket.emit('getMessage', message);
    console.log('使用者所在房間..', findRooms(socket));
    console.log('server管理所有房間', roomSet);
  });
  socket.on('create room', (roomId) => {
    socket.join(roomId);
    console.log(`使用者${socket.id}創建了room #${roomId}`);
    roomSet.add(roomId);
  });
  socket.on('join room', (roomId) => {
    if (roomSet.has(roomId)) {
      socket.join(roomId);
      socket.emit('join auth', { auth: true });
      console.log(`使用者${socket.id}加入了room #${roomId}`);
    } else {
      console.log(`沒有roomId #${roomId}`);
      socket.emit('join auth', { auth: false });
    }
  });

  //當使用者斷線，要做leave room 動作
  socket.on('disconnect', function () {
    let nowRoom = findRooms(socket);
    console.log('離開前所有room...', nowRoom);
    //從roomSet中移除該room

    nowRoom.forEach((room) => {
      console.log(room);
    });
    socket.leave(nowRoom);
    nowRoom = findRooms(socket);
    console.log('離開所有room...', nowRoom);
    console.log('user disconnected');
  });
});

server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
