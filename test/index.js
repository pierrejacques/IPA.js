'use strict';

const assert = require('assert');
const expect = require('chai').expect;
const IPA = require('../dist/ipa.js');

function test(cases) {
    cases.forEach(item => {
        const instance = new IPA(item.template);
        const skipDeepTest = item.skipDeepTest;
        describe(`${item.desc}`, () => {
            it('should be self-consistence', () => {
                Array.apply(null, { length: 20 }).forEach(() => {
                    const mocked = instance.mock();
                    const prodMock = instance.mock({}, true);
                    expect(instance.check(mocked)).to.be.equal(true);
                    skipDeepTest || expect(instance.guarantee(mocked)).to.deep.equal(mocked);
                    expect(instance.guarantee(mocked, { copy: false })).to.be.equal(mocked);
                    skipDeepTest || expect(instance.guarantee(mocked, { strict: true })).to.deep.equal(mocked);
                    expect(instance.guarantee(mocked, { copy: false, strict: true })).to.be.equal(mocked);
                    expect(instance.check(prodMock)).to.be.equal(true);
                    skipDeepTest || expect(instance.guarantee(prodMock)).to.deep.equal(prodMock);
                    expect(instance.guarantee(prodMock, { copy: false })).to.be.equal(prodMock);
                    skipDeepTest || expect(instance.guarantee(prodMock, { strict: true })).to.deep.equal(prodMock);
                    expect(instance.guarantee(prodMock, { copy: false, strict: true })).to.be.equal(prodMock);
                });
            });
            item.situations.forEach(situation => {
                it(`should act correctly when ${situation.name}`, () => {
                    const inputs = situation.inputs || [situation.input];
                    const cRes = situation.check;
                    const gRes = situation.guarantee;
                    const sRes = situation.strict;
                    instance.strategy = situation.strategy || 'shortest',
                    inputs.forEach(input => {
                        expect(instance.check(input)).to.be.equal(cRes);
                        skipDeepTest || expect(instance.guarantee(input)).to.deep.equal(gRes);
                        skipDeepTest || expect(instance.guarantee(input, { strict: true })).to.deep.equal(sRes);
                    });
                });
            })
        });
    });
}


describe(`

===== | TESTING COMPILERS | =====

`, () => {
    test([
        ...require('./compile/function'),
        ...require('./compile/boolean'),
        ...require('./compile/string'),
        ...require('./compile/number'),
        ...require('./compile/array'),
        ...require('./compile/object'),
        ...require('./compile/ipa')(IPA),
    ]);
});

describe(`

===== | TESTING STATICS | =====

`, () => {
    test([
        ...require('./static/or')(IPA),
        ...require('./static/asClass')(IPA),
        ...require('./static/Dict')(IPA),
        ...require('./static/Each')(IPA),
        ...require('./static/From')(IPA),
        ...require('./static/Integer')(IPA),
        ...require('./static/Range')(IPA),
        ...require('./static/assemble')(IPA),
        ...require('./static/recurse')(IPA),
    ]);
});

describe(`
===== | FUNCTIONAL | =====

`, () => {
    describe('defined & Type Proxy', () => {
        it('should be callable before defined', () => {
            const testProxy = IPA.Type('testType');
            IPA.define('testType', {
                prop: Number,
            });
            expect(testProxy.check({ prop: 1 })).to.be.equal(true);
            expect(testProxy.guarantee({ prop: 1 })).to.deep.equal({ prop: 1 });
            expect(testProxy.check({ prop: '1' })).to.be.equal(false);
            expect(testProxy.guarantee({ prop: '1' })).to.deep.equal({ prop: 1 });
            expect(testProxy.check(testProxy.mock())).to.be.equal(true);
        });
    });
});
