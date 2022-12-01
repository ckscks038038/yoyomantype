const Words = require('../models/words_model');

const getWords = async (req, res) => {
  const wordsNum = req.body.wordsNum;
  const words = await Words.getWords(wordsNum);
  const wordsArr = words.map((word) => {
    return word.text;
  });
  return res.send({ wordsArr });
};

const getFuzzySearchWords = async (req, res) => {
  const word = req.body.word;
  const result = await Words.getFuzzySearchWords(word);
  const resultArr = result.map((resultObj) => {
    return resultObj['_source'].word;
  });
  return res.send(resultArr);
};

module.exports = {
  getWords,
  getFuzzySearchWords,
};
