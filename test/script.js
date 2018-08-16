const IPA = require('../dist/ipa');

const a = Array(1000000).fill(null).map(() => ({
    prop: Math.random(),
    prop2: 'asd',
}));

const ipa = new IPA([{
    prop: Number,
    prop2: String,
}]);
console.time('IPA 4.2.0: ');
console.log(ipa.check(a));
console.timeEnd('IPA 4.2.0: ');
