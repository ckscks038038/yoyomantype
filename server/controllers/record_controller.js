const Record = require('../models/record_model');

const insertRecord = async (req, res) => {
  const recordData = req.body;
  const [acc, cpm, accounts_id] = [recordData.acc, recordData.cpm, req.user.id];

  const result = await Record.insertRecordDB(acc, cpm, accounts_id);

  return res.send(result);
};

module.exports = {
  insertRecord,
};
