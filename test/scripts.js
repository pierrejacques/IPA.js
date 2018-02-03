const IPA = require('../dist/ipa.min.js').default;

const weekDataTemplate = {
    x: [Number, 'l'],
    y: [String, 'l'],
};

const ipa = new IPA(weekDataTemplate);

ipa.setConfig({ strategy: 'shortest' });

const incomingData = {
    x: [0.1, 0.15, 0.07],
    y: ['Mon', 'Tue'],
};

console.log(JSON.stringify(ipa.guarantee()));
