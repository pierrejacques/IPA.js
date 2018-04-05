'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const IPA = require('../dist/ipa.js');

const cases = [
    ...require('./cases/function'),
    ...require('./cases/boolean'),
    ...require('./cases/string'),
    ...require('./cases/number'),
];

cases.forEach(c => {
    const instance = new IPA(c.template);
    describe(`${c.desc}`, () => {
        it('should be self-consistence', () => {
            Array.apply(null, { length: 100 }).forEach(() => {
                const mocked = instance.mock();
                const prodMock = instance.mock({}, true);
                expect(instance.check(mocked)).to.be.equal(true);
                expect(instance.guarantee(mocked, true, false)).to.deep.equal(mocked);
                expect(instance.guarantee(mocked, false, false)).to.be.equal(mocked);
                expect(instance.guarantee(mocked, true, true)).to.deep.equal(mocked);
                expect(instance.guarantee(mocked, false, true)).to.be.equal(mocked);
                expect(instance.check(prodMock)).to.be.equal(true);
                expect(instance.guarantee(prodMock, true, false)).to.deep.equal(prodMock);
                expect(instance.guarantee(prodMock, false, false)).to.be.equal(prodMock);
                expect(instance.guarantee(prodMock, true, true)).to.deep.equal(prodMock);
                expect(instance.guarantee(prodMock, false, true)).to.be.equal(prodMock);
            });
        });
        c.situations.forEach(situation => {
            it(`should act correctly when ${situation.name}`, () => {
                const inputs = situation.inputs || [situation.input];
                const cRes = situation.check;
                const gRes = situation.guarantee;
                const sRes = situation.strict;
                inputs.forEach(input => {
                    expect(instance.check(input)).to.be.equal(cRes);
                    expect(instance.guarantee(input)).to.deep.equal(gRes);
                    expect(instance.guarantee(input, true, true)).to.deep.equal(sRes);
                });
            });
        })
    });
});