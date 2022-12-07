const Room = require('../../utils/roomMap');

module.exports = (io) => {
  function saveArticle({ roomId, words }) {
    Room.saveArticleToMap(roomId, words);
  }

  function updateArticle(roomId) {
    io.to(roomId).emit('get article', Room.getArticleFromMap(roomId));
  }
  return { saveArticle, updateArticle };
};
