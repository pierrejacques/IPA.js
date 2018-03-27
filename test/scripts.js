const IPA = require('../dist/ipa.js');

const ipa = new IPA({
    x: [0, 'l'],
    y: ['', 'l'],
    z: Boolean,
});

console.log(ipa.guarantee({
    x: [1, 2],
    y: ['1', '2'],
}));

console.log(ipa.guarantee({
    x: [],
    y: [],
    z: true,
}));