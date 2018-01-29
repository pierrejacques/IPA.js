'use strict';

const assert = require('assert');
const IPA = require('../dist/index.js').default;

// cases
const singleCheckCases = require('./cases/check.single.js');
const arrayCheckCases = require('./cases/check.array.js');

const allCases = [
    singleCheckCases,
    arrayCheckCases,
];

allCases.forEach(cases => {
    cases.forEach(caseGroup => {
        describe(caseGroup.name, () => {
            const instance = new IPA(caseGroup.template);
            caseGroup.cases.forEach(item => {
                describe(item.name, () => {
                    it(`should ${item.method} without error`, () => {
                        assert.equal(instance[item.method](item.data), item.result);
                    });
                });
            });
        });
    });
});
