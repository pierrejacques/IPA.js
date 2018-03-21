'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const IPA = require('../dist/ipa.min.js');

// cases
const singleCheckCases = require('./cases/check.single.js');
const arrayCheckCases = require('./cases/check.array.js');
const objectCheckCases = require('./cases/check.object.js');
const mockCases = require('./cases/mock.js');
const guaranteeCases = require('./cases/guarantee.js');

const allCases = [
    singleCheckCases,
    arrayCheckCases,
    objectCheckCases,
    mockCases,
    guaranteeCases,
];

const testers = {
    check(instance, testCase) {
        describe(testCase.name, () => {
            it(`should check without error`, () => {
                expect(instance.check(testCase.data)).to.be.equal(testCase.result);
            });
        });
    },
    guarantee(instance, testCase) {
        describe(testCase.name, () => {
            it(`should guarantee without error`, () => {
                const data = testCase.data;
                let output;
                if (testCase.valid === true) {
                    expect(instance.check(data)).to.be.equal(true);
                    output = instance.guarantee(data);
                    expect(JSON.stringify(output)).to.be.equal(JSON.stringify(data));
                } else {
                    expect(instance.check(data)).to.be.equal(false);
                    output = instance.guarantee(data);
                }
                expect(instance.check(output)).to.be.equal(true);
            });
        })
    },
    mock(instance, testCase) {
        const time = testCase.time || 1;
        describe(testCase.name, () => {
            it(`should mock without error`, () => {
                Array.apply(null, { length: time}).forEach((item, idx) => {
                    const mockData = instance.mock(testCase.data);
                    expect(instance.check(mockData)).to.be.equal(true);
                });
            });
        });
    },
}

allCases.forEach(cases => {
    cases.forEach(caseGroup => {
        describe(caseGroup.name, () => {
            const instance = new IPA(caseGroup.template);
            caseGroup.cases.forEach(testCase => {
                testers[testCase.method](instance, testCase);
            });
        });
    });
});
