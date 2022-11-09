const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 3300;
const db = require('./utils/pg');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const text = `SELECT city_name, avg(temp_c)
                  FROM weather_metrics
                  WHERE time > now() - INTERVAL '2 years'
                  GROUP BY city_name;`;
    const ans = await db.query(text);
    return res.json(ans.rows);
  } catch (err) {
    console.log(err.stack);
  }
});

app.post('/todos', async (req, res) => {
  try {
    console.log(req.body);
  } catch (err) {
    console.log(err);
  }
});

// socket io
io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
