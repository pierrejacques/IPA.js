const IPA = require('../dist/ipa.js');

IPA.addCatcher((err) => {
    console.log(err);
});

const num = new IPA({
    num: Number,
    string: String,
    object: {
        boolean: Boolean
    }
});

console.log(
    num.check({
        num: 123,
        string: '123',
        object: {
            boolean: 12,
        }
    })
);
