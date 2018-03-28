const IPA = require('../dist/ipa.js');
const { Each, Range } = IPA;

const ipa = new IPA(Each([
    Number,
    Range(10, 20),
    Boolean,
], false));

console.log(ipa.mock());