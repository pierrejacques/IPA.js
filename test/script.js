const IPA = require('../dist/ipa');

IPA.onError((exp) => {
    console.log('from IPA: ', exp);
});

const schema = new IPA(Number);

schema.onError((exp) => {
    console.log('from instance: ', exp);
    exp.stopPropagation();
});

schema.check('123', (exp) => {
    console.log('from check: ', exp);
});

console.log(
    schema.guarantee('123', { }, (exp) => {
        console.log('from guarantee: ', exp);
    })
)
