const IPA = require('../dist/ipa.js');
const { From } = IPA;

const ipa = new IPA(From(new Map([
    [1, {
        type: 0,
        name: '云店助手',
    }],
    [2, {
        type: 1,
        name: '字典表',
    }],
]), true));

console.log(ipa.mock());