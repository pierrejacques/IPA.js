const IPA = require('../dist/ipa.js');
const lodash = require('lodash');

const schema = new IPA(null);

schema.strategy = 'a';
console.log(schema.strategy);