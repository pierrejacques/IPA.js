const IPA = require('../dist/ipa.js');

const func = new IPA(Function);

console.log(func.check(function () {}));
console.log(func.guarantee(null));
console.log(func.mock({}, true));