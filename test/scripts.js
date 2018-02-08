const IPA = require('../dist/ipa.min.js').default;

const r = new IPA(val => ({
    isValid: true,
    value: val,
}));
r.setConfig({ seed: '123' })
console.log(r.mock())
console.log(r.guarantee())
