const client = require('./es');
const words = require('./Mieliestronk-English-words.json');

const run = async () => {
  for (let i = 0; i < words.length; i++) {
    const word = words[i].aardvark;
    // console.log(word);
    await client.index({ index: 'word-data-set', body: { word } });

    console.log('word in ->', i);
  }
};
run().catch(console.log);
