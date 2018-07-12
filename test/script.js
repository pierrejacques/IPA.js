const IPA = require('../dist/ipa.js');
const { Each } = IPA;
let count = 0;
IPA.onError((err) => {
    console.log(++count, err);
});

const num = new IPA(Each([Number, Boolean, Array], false));

num.guarantee([1, true, [], '1']);
