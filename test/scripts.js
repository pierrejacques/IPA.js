const IPA = require('../dist/ipa.js');
const lodash = require('lodash');

const obj1 = { a: 1 };
const { From } = IPA;

const schema = new IPA(From([null, obj1, "--", 1]));

// const mocked = schema.mock();
const mocked = obj1;
console.log(mocked);
console.log(schema.check(mocked));
console.log(schema.guarantee(mocked));