const IPA = require('../dist/ipa.min.js').default;

const checkNum = val => val !== undefined && val !== null && val !== '';

const ipa = new IPA({
    id: '',
    name: '--',
    desc: '',
    dataType: 0,
    value(val) {
        console.log(val);
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
    }, 2],
});

const incomingData = {
    value: 123
};

console.log(JSON.stringify(ipa.guarantee(incomingData)));
