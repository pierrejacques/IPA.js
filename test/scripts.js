const IPA = require('../dist/ipa.js');

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

console.log(rowsIpa)

console.log(rowsIpa.mock());
