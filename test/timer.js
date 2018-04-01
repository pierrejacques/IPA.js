const IPA = require('../dist/ipa.js');

const i = new IPA([String, 1000000]);
const startTime = +new Date();
i.mock();
const endTime = +new Date();

console.log(`time spent: ${endTime - startTime}ms`);