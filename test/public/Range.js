Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = IPA => [
    {
        desc: 'When template = Range(100, 110)',
        template: IPA.Range(100, 110),
        situations: [{
            name: 'inputting: right Range',
            input: 104,
            check: true,
            guarantee: 104,
            strict: 104,
        }, {
            name: 'inputting: too big',
            input: 120,
            check: false,
            guarantee: 110,
            strict: 110,
        }, {
            name: 'inputting: too small',
            input: 90,
            check: false,
            guarantee: 100,
            strict: 100,
        }, {
            name: 'inputting: not Number',
            inputs: [true, ''],
            check: false,
            guarantee: 100,
            strict: 100,
        }, {
            name: 'inputting: convertable too small',
            input: '0',
            check: false,
            guarantee: 100,
            strict: 100,
        }, {
            name: 'inputting: convertable right range',
            input: '106',
            check: false,
            guarantee: 106,
            strict: 100,
        }, {
            name: 'inputting: convertable too big',
            input: '120',
            check: false,
            guarantee: 110,
            strict: 100,
        }, ],
    }
]