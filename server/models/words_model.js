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

const getFuzzySearchWords = async (word) => {
  try {
    const { body } = await client.search({
      index: 'word-data-set',
      body: {
        query: {
          fuzzy: {
            word: {
              value: word,
            },
          },
        },
      },
    });
    return body.hits.hits;
  } catch (err) {
    console.log(err);
  }
};

const getQueryStringWords = async (word) => {
  console.log(3, word);
  try {
    const { body } = await client.search({
      index: 'word-data-set',
      body: {
        query: {
          query_string: { default_field: 'word', query: `*${word}*` },
        },
        size: 10,
      },
    });
    console.log(body);
    return body.hits.hits;
  } catch (err) {
    console.log(err);
  }
};
module.exports = { getWords, getFuzzySearchWords, getQueryStringWords };
