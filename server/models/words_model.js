const db = require('../utils/pg');

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

module.exports = { getWords };
