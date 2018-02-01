const IPA = require('../dist/bundle.js').default;

const ipa = new IPA({
    legend: [String, 'l1'],
    series: [{
        x: [String, 'l2'],
        y: [0, 'l2'],
    }, 'l1']
});

ipa.setConfig({
    strategy: 'average',
    min: 100,
    max: 200,
    minLen: 20,
    maxLen: 30,
    dict: [
        '指标1',
        '指标2',
        '指标3',
        '指标4',
        '指标5',
    ],
});

const out = ipa.mock({ l1: 3,  l2: 10 });

console.log(JSON.stringify(out));
