const IPA = require('../dist/ipa.min.js').default;

const checkNum = val => !(val === undefined || val === null || val === '');

const ipa = new IPA({
    id: '',
    name: '--',
    dataType: 0,
    desc: '-',
    value(val) {
        return {
            isValid: true,
            value: checkNum(val) ? val : '--',
        }
    },
    info: [{
        key: '',
        value(val) {
            return {
                isValid: true,
                value: checkNum(val) ? val : '--',
            }
        },
    }, 3],
});

console.log(ipa.mock());
console.log(ipa.guarantee({}));
