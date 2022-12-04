const { Client } = require('@elastic/elasticsearch');
require('dotenv').config;

const client = new Client({
  node: process.env.ELASTIC_SEARCH_URL,
});
client.ping(function (error) {
  if (error) {
    console.log(error);
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('elasticsearch connected successfully');
  }
});
module.exports = client;
