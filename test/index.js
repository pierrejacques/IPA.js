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
                    skipDeepTest || expect(instance.guarantee(mocked, true, false)).to.deep.equal(mocked);
                    expect(instance.guarantee(mocked, false, false)).to.be.equal(mocked);
                    skipDeepTest || expect(instance.guarantee(mocked, true, true)).to.deep.equal(mocked);
                    expect(instance.guarantee(mocked, false, true)).to.be.equal(mocked);
                    expect(instance.check(prodMock)).to.be.equal(true);
                    skipDeepTest || expect(instance.guarantee(prodMock, true, false)).to.deep.equal(prodMock);
                    expect(instance.guarantee(prodMock, false, false)).to.be.equal(prodMock);
                    skipDeepTest || expect(instance.guarantee(prodMock, true, true)).to.deep.equal(prodMock);
                    expect(instance.guarantee(prodMock, false, true)).to.be.equal(prodMock);
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
                        skipDeepTest || expect(instance.guarantee(input, true, true)).to.deep.equal(sRes);
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

===== | TESTING PUBLICS | =====

`, () => {
    test([
        ...require('./public/or')(IPA),
        ...require('./public/asClass')(IPA),
        ...require('./public/Dict')(IPA),
        ...require('./public/Each')(IPA),
        ...require('./public/From')(IPA),
        ...require('./public/Integer')(IPA),
        ...require('./public/Range')(IPA),
        ...require('./public/assemble')(IPA),
        ...require('./public/recurse')(IPA),
    ]);
});