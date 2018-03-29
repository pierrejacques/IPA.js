const IPA = require('../dist/ipa.js');
const { or, From } = IPA;
const NumberableString = new IPA(() => ({
    check(v) {
        return (+v).toString() === v;
    },
}));
IPA.inject('numberLike', or(From(['--']), Number, NumberableString));

console.log(IPA.getInstance('numberLike').check('1'));