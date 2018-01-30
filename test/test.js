'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const IPA = require('../dist/index.js').default;

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
                const output = instance.guarantee(data);
                expect(instance.check(output)).to.be.equal(true);
                if (testCase.valid === true) {
                    expect(instance.check(data)).to.be.equal(true);
                    expect(JSON.stringify(output)).to.be.equal(JSON.stringify(data));
                } else {
                    expect(instance.check(data)).to.be.equal(false);
                }
            });
        })
    },
    mock(instance, testCase) {
        const time = testCase.time || 1;
        describe(testCase.name, () => {
            it(`should mock without error`, () => {
                for (let i = 0; i < time; i++) {
                    const mockData = instance.mock(testCase.data);
                    expect(instance.check(mockData)).to.be.equal(true);
                }
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
