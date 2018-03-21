const IPA = require('../dist/ipa.min.js');

// 先来个玩耍性质的
const string = new IPA(String);

const rowsIpa = new IPA([{
    id: Number,
    index: Number,
    UIRate: 4,
    cols: [{
        id: Number,
        index: Number,
        UIRate: 4,
        chartId: Number,
        chartName: String,
        downloadable: false,
        editable: false,
        UIType: Number,
    }, 'c'],
}, 'r']);

rowsIpa.setConfig({
    max: 4,
    min: 1,
    minLen: 1,
    maxLen: 3,
});

console.log(rowsIpa)

console.log(rowsIpa.mock());
