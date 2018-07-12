const IPA = require('../dist/ipa.js');

IPA.onError((err) => {
    console.log(err);
});

const num = new IPA([Boolean, 3])

num.guarantee([1, true, ]);
