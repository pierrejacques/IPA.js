const IPA = require('../dist/ipa.js');
const { Range } = IPA;
let count = 0;
IPA.onError((err) => {
    console.log(++count, err);
});

const num = new IPA([Number, 3]);

console.log(
    num.mock()
)
