const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
const { API_VERSION } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/' + API_VERSION, [
  require('./server/routes/words_route'),
  require('./server/routes/multiplayer_route'),
  require('./server/routes/user_route'),
  require('./server/routes/record_route'),
]);

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
