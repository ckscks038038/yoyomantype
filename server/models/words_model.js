const db = require('../utils/pg');

const getWords = async () => {
  try {
    const query = `
	CREATE TABLE users (
		email varchar,
		firstName varchar,
		lastName varchar,
		age int
);
`;
    const ans = await db.query(query);
    return res.json(ans.rows);
  } catch (err) {
    console.log(err.stack);
  }
};
