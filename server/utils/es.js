const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'http://35.73.111.103:9200/',
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
