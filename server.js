const http = require('http');
const httpServer = require('./httpServer');
const server = http.createServer(httpServer);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });
require('dotenv').config();
const { PORT } = process.env;

const {
  createRoom,
  checkRoom,
  joinRoom,
} = require('./server/socket/controllers/room_controller');

const {
  startGame,
  finishGame,
  changeGuestState,
  updateUsersProgress,
  getUsersProgress,
} = require('./server/socket/controllers/game_controller')(io);

const { saveArticle, updateArticle } =
  require('./server/socket/controllers/article_controller')(io);

const { resetCountdown, startCountdown } =
  require('./server/socket/controllers/timer_controller')(io);

const { disconnect } =
  require('./server/socket/controllers/disconnect_controller')(io);

// socket io
io.on('connection', (socket) => {
  socket.on('create room', createRoom);
  socket.on('check room', checkRoom);
  socket.on('join room', joinRoom);
  socket.on('start game', startGame);
  socket.on('change guest state', changeGuestState);
  socket.on('finish game', finishGame);
  socket.on('update users progress', updateUsersProgress);
  socket.on('get users progress', getUsersProgress);
  socket.on('save article', saveArticle);
  socket.on('update article', updateArticle);
  socket.on('resetCountdown', resetCountdown);
  socket.on('startCountdown', startCountdown);
  socket.on('disconnect', disconnect);
});

server.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
