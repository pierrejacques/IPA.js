Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = { name: String }',
        template: { name: String },
        situations: [{
            name: 'inputting: empty object',
            input: {},
            check: false,
            guarantee: { name: '' },
            strict: { name: '' },
        }, {
            name: 'inputting: right object',
            input: { name: 'jin', age: 12 },
            check: true,
            guarantee: { name: 'jin', age: 12 },
            strict: { name: 'jin', age: 12 },
        }, {
            name: 'inputting: almost right object',
            input: { name: 123, age: 12 },
            check: false,
            guarantee: { name: '123', age: 12 },
            strict: { name: '', age: 12 },
        }, {
            name: 'inputting: wrong types',
            inputs: [
                new Boolean(),
                new Array(),
                new Function(),
                new String(),
                new Number(),
                null,
                undefined,
                1,
                'a',
                true,
            ],
            check: false,
            guarantee: { name: '' },
            strict: { name: '' },
        }],
    },
    {
        desc: 'When template = { a: { a: { a: String}}}',
        template: { a: { a: { a: String}}},
        situations: [{
            name: 'right deep',
            input: { a: { a: { a: 'a' }}},
            check: true,
            guarantee: { a: { a: { a: 'a' }}},
            strict: { a: { a: { a: 'a' }}},
        }, {
            name: 'wrong type',
            input: { a: { a: { a: 1 }}},
            check: false,
            guarantee: { a: { a: { a: '1' }}},
            strict: { a: { a: { a: '' }}},
        }, {
            name: 'wrong structure',
            input: { a: { a: { b: 'a' }}},
            check: false,
            guarantee: { a: { a: { a: '', b: 'a' }}},
            strict: { a: { a: { a: '', b: 'a' }}},
        }]
    }
];
