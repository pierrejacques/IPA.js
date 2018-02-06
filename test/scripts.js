const IPA = require('../dist/ipa.min.js').default;
const ipa = new IPA([undefined, 4]);
console.log(ipa.guarantee([1,'2',{}, true]));
