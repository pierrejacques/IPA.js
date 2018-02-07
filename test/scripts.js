const IPA = require('../dist/ipa.min.js').default;
const ipa = new IPA({ x: Number, y: String });

a = {
    x: '12',
    y: 12,
};

console.log(ipa.getConfig(null));
console.log(ipa)
