const db = require('../utils/pg');
const client = require('../utils/es');

const getWords = async (wordsNum) => {
  try {
    const query = `
	SELECT text FROM words
    ORDER BY RANDOM()
    LIMIT ${wordsNum}
`;
    const ans = await db.query(query);
    return ans.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

const getsimilarWords = async () => {
  try {
    const { body } = await client.search({
      index: 'word-data-set',
      body: {
        query: {
          match_all: {},
        },
      },
    });
    console.log('len: ', body);
    return body;
  } catch (err) {
    console.log('GG');
    console.log(err);
  }
};

module.exports = { getWords, getsimilarWords };
