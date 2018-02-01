const IPA = require('../dist/index.js').default;

const ipa = new IPA({
    x: [0, 10],
    y: ['', 8],
});

const out = ipa.guarantee({
    x: [1,2,3,4,5],
    y: ['', '', '', '', '', ''],
});

console.log(out);
