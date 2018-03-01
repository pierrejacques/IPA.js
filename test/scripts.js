const IPA = require('../dist/ipa.min.js');

const r = new IPA({
    x: [0, 'l'],
    y: ['', 'l'],
    z: Boolean,
});

console.log(r.check(r.guarantee(({
    x: [1, 2, 3],
    y: ['1', '2'],
    z: true,
}))));
