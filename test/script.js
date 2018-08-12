const IPA = require('../dist/ipa.js');

const recurse = IPA.recurse;

const twoRecurse = new IPA({
    tree1: recurse([{
        name: String,
        children: '$$',
    }]),
    tree2: recurse([{
        name: String,
        children: '$$',
    }]),
});
