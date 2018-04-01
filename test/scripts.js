const IPA = require('../dist/ipa.js');
const lodash = require('lodash');

const i = new IPA(Array);

const m = i.mock();

console.log(m === i.guarantee(m))
console.log(m === i.guarantee(m, false))