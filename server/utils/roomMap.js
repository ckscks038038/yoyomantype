const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require('unique-names-generator');

const rooms = {};

//創建房間
const createNewRoomToMap = ({ roomId, ownerId }) => {
  //給使用者隨機的動物名字
  const randomName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
  });

  //更新roomMap
  rooms[roomId] = { users: {}, article: 'test' };
  rooms[roomId].users[ownerId] = randomName;
  console.log(`room ${roomId} is created by ${ownerId}.`);
};

//儲存文章
const saveArticleToMap = (roomId, article) => {
  rooms[roomId].article = article;
};

//取得文章
const getArticleFromMap = (roomId) => {
  return rooms[roomId].article;
};

//加入房間
const JoinRoomToMap = ({ roomId, userId }) => {
  const randomName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
  });

  rooms[roomId].users[userId] = randomName;
  console.log('照理說會有兩個使用者', rooms[roomId].users);
  // console.log('new connceted: ', rooms);
};

//離開房間
const removeDisroomsFromMap = (roomId, userId) => {};

//檢查房間存在
const checkRoomIdExistInMap = (roomId) => {
  return rooms.hasOwnProperty(roomId);
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
};
