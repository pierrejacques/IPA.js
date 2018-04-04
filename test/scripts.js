const IPA = require('../dist/ipa.js');
const lodash = require('lodash');

const sub = IPA.getInstance('numberlike');

IPA.inject('numberlike', IPA.or(Number, String));

const superInstance = new IPA([sub]);

console.log(superInstance.guarantee(['123', 1, true]));
