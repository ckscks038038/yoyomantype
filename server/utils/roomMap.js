const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require('unique-names-generator');

const rooms = {};

//**********************Mulitplayer Page ***********************/

//創建房間(房主)
const createNewRoomToMap = ({ roomId, ownerId, socket }) => {
  //給使用者隨機的動物名字
  const randomName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
  });
  socket.name = randomName;
  //儲存房主ID, 動物名稱
  rooms[roomId] = { users: {}, article: '', gameState: '' };
  rooms[roomId].users[ownerId] = { name: randomName, typed: 0 };
  rooms[roomId].gameState = 'start';
};

//儲存文章(房主)
const saveArticleToMap = (roomId, article) => {
  rooms[roomId].article = article;
};

//取得文章(房客)
const getArticleFromMap = (roomId) => {
  return rooms[roomId].article;
};

//加入房間(房客)
const JoinRoomToMap = ({ roomId, userId, socket }) => {
  const randomName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
  });
  socket.name = randomName;
  rooms[roomId].users[userId] = { name: randomName, typed: 0 };
  console.log('(server)所有房間的人：', rooms[roomId].users);
};

//**********************進入Game Page **************************/

//開始遊戲
const changeStartStateToMap = (roomId) => {
  rooms[roomId].gameState = 'run';
};

//結束遊戲
const changeFinishStateToMap = (roomId) => {
  rooms[roomId].gameState = 'finish';
};

//******************** 離開房間、確認房間狀態 ***********************/

//離開房間
const removeUserFromRoomInMap = (roomId, userId) => {
  console.log('roomId', roomId, userId);
  console.log('到底', rooms[roomId]);

  delete rooms[roomId].users[userId];
  console.log('確認是否移除使用者', rooms[roomId].users);
};

const findUserInRoomInMap = (userId) => {
  const arrOfRooms = findAllRoomsInMap();
  let theRoom = '';
  arrOfRooms.forEach((room) => {
    if (rooms[room].users.hasOwnProperty(userId)) {
      theRoom = room;
    }
  });
  return theRoom === '' ? null : theRoom;
};

//檢查房間存在
const checkRoomIdExistInMap = (roomId) => {
  return rooms.hasOwnProperty(roomId);
};

//取得房間所有人狀態(name, typed)
const getUsersProgressInMap = (roomId) => {
  if (rooms[roomId]) {
    return rooms[roomId];
  }
};

//更新房間玩家狀態
const updateUsersProgressToMap = (roomId, userId, totalTyped) => {
  // console.log('檢查', roomId, userId, totalTyped);
  rooms[roomId].users[userId].typed = totalTyped;
  // console.log('玩家進度：', rooms[roomId].users[userId].typed);
};
//檢查房間狀態
const checkRoomStateInMap = (roomId) => {
  return rooms[roomId].gameState === 'run';
};

//找出所有房間
const findAllRoomsInMap = () => {
  const arrOfRoomId = Object.keys(rooms);
  return arrOfRoomId;
};

module.exports = {
  JoinRoomToMap,
  removeUserFromRoomInMap,
  createNewRoomToMap,
  checkRoomIdExistInMap,
  saveArticleToMap,
  getArticleFromMap,
  changeStartStateToMap,
  changeFinishStateToMap,
  getUsersProgressInMap,
  updateUsersProgressToMap,
  findUserInRoomInMap,
};
