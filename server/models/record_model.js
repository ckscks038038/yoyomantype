const db = require('../utils/pg');

const insertRecordDB = async (acc, cpm, accounts_id) => {
  try {
    const query = `INSERT INTO "history_time" (acc, cpm, accounts_id, date)  
             VALUES ($1,$2,$3,current_timestamp)`;
    const result = await db.query(query, [acc, cpm, accounts_id]);
    return result.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

// const test = async () => {
//   insertRecord(1, 2, 66);
// };
// test();
module.exports = { insertRecordDB };
