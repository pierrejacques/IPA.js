const IPA = require('../dist/ipa.js');
const { or, From } = IPA;

IPA.addCatcher((err) => {
    console.log(err);
});

const num = new IPA(or(Number, String, From(null)));

console.log(
    num.guarantee(undefined)
);
