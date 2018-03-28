const IPA = require('../dist/ipa.js');
const { From } = IPA;

const a = {
    type: 0,
    name: '云店助手',
};

const ipa = new IPA(From(new Set([
    a,
    {
        type: 1,
        name: '字典表',
    },
])));

console.log(ipa.check(a));