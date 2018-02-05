const IPA = require('../dist/ipa.min.js').default;

const weekDataTemplate = {
    x: String
};

const ipa = new IPA(weekDataTemplate);

ipa.setConfig({ strategy: 'shortest' });

const incomingData = {
    x: 123
};

console.log(JSON.stringify(ipa.guarantee(incomingData)));
