const client = require('./es');
const words = require('./words.json');

const run = async () => {
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    await client.index({ index: 'word-data-set', body: { word } });

    console.log('word in ->', i);
  }
};
run().catch(console.log);
