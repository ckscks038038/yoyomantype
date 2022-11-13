const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require('unique-names-generator');

const rooms = {};

//**********************Mulitplayer Page ***********************/

//創建房間(房主)
const createNewRoomToMap = ({ roomId, ownerId }) => {
  //給使用者隨機的動物名字
  const randomName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
  });

  //儲存房主ID, 動物名稱
  rooms[roomId] = { users: {}, article: '', gameState: '' };
  rooms[roomId].users[ownerId] = randomName;
  rooms[roomId].gameState = 'start';
  console.log(`room ${roomId} is created by ${ownerId}.`);
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
const JoinRoomToMap = ({ roomId, userId }) => {
  const randomName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
  });
  rooms[roomId].users[userId] = randomName;
  console.log('所有使用者狀態', rooms[roomId].gameState);
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
const removeDisroomsFromMap = (roomId, userId) => {};

//檢查房間存在
const checkRoomIdExistInMap = (roomId) => {
  return rooms.hasOwnProperty(roomId);
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
  removeDisroomsFromMap,
  createNewRoomToMap,
  checkRoomIdExistInMap,
  findAllRoomsInMap,
  saveArticleToMap,
  getArticleFromMap,
  changeStartStateToMap,
  changeFinishStateToMap,
};
