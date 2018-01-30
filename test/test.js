'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const IPA = require('../dist/index.js').default;

// cases
const singleCheckCases = require('./cases/check.single.js');
const arrayCheckCases = require('./cases/check.array.js');
const objectCheckCases = require('./cases/check.object.js');
const mockCases = require('./cases/mock.js');

const allCases = [
    singleCheckCases,
    arrayCheckCases,
    objectCheckCases,
    mockCases,
];

allCases.forEach(cases => {
    cases.forEach(caseGroup => {
        describe(caseGroup.name, () => {
            const instance = new IPA(caseGroup.template);
            caseGroup.cases.forEach(item => {
                if (item.method === 'mock') {
                    const time = item.time || 1;
                    describe(item.name, () => {
                        it(`should ${item.method} without error`, () => {
                            for (let i = 0; i < time; i++) {
                                const mockData = instance.mock(item.data);
                                expect(instance.check(mockData)).to.be.equal(true);
                            }
                        });
                    });
                } else {
                    describe(item.name, () => {
                        it(`should ${item.method} without error`, () => {
                            expect(instance[item.method](item.data)).to.be.equal(item.result);
                        });
                    });
                }
            });
        });
    });
});
