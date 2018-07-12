const IPA = require('../dist/ipa.js');
const { or, From } = IPA;

IPA.onError((err) => {
    console.log(err);
});

const num = new IPA([Boolean, 3]);

num.guarantee(undefined);
