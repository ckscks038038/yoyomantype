const Words = require('../models/words_model');

const getWords = async (req, res) => {
  const wordsNum = req.body.wordsNum;
  const words = await Words.getWords(wordsNum);
  const wordsArr = words.map((word) => {
    return word.text;
  });
  return res.send({ wordsArr });
};

const getsimilarWords = async (req, res) => {
  const result = await Words.getsimilarWords();
  return res.send(result);
};

module.exports = {
  getWords,
  getsimilarWords,
};
