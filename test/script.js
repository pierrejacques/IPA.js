const IPA = require('../dist/ipa.js');

IPA.addCatcher((err) => {
    console.log('from IPA', err);
});

const num = new IPA(Number);

num.addCatcher((err) => {
    console.log('from instance', err);
});

num.check('');
num.check(false);
