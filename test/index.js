'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const IPA = require('../dist/ipa.js');

const cases = [
    ...require('./cases/number'),
    ...require('./cases/boolean'),
    ...require('./cases/string'),
    ...require('./cases/array'),
];

cases.forEach(c => {
    const instance = new IPA(c.template);
    describe(`${c.desc}`, () => {
        it('should be self-consistence', () => {
            Array.apply(null, { length: 100 }).forEach(() => {
                const mocked = instance.mock();
                expect(instance.check(mocked)).to.be.equal(true);
                expect(instance.guarantee(mocked, true)).to.deep.equal(mocked);
                expect(instance.guarantee(mocked, false)).to.be.equal(mocked);
            });
        });
        c.situations.forEach(situation => {
            it(`should act correctly when ${situation.name}`, () => {
                const inputs = situation.inputs || [situation.input];
                const cRes = situation.check;
                const gRes = situation.guarantee;
                inputs.forEach(input => {
                    expect(instance.check(input)).to.be.equal(cRes);
                    expect(instance.guarantee(input)).to.deep.equal(gRes);
                });
            });
        })
    });
});