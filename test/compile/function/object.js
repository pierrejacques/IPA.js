Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = Object',
        template: Object,
        situations: [{
            name: 'inputting: empty object',
            input: {},
            check: true,
            guarantee: {},
            strict: {},
        }, {
            name: 'inputting: object',
            input: { name: 'jin', age: 12 },
            check: true,
            guarantee: { name: 'jin', age: 12 },
            strict: { name: 'jin', age: 12 },
        }, {
            name: 'inputting: wrong types',
            inputs: [
                new Boolean(),
                new Array(),
                new Function(),
                new String(),
                new Number(),
                undefined,
                null,
                1,
                'a',
                false,
            ],
            check: false,
            guarantee: {},
            strict: {},
        }],
    },
];
