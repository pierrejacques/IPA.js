Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = Array',
        template: Array,
        situations: [{
            name: 'inputting: empty array',
            input: [],
            check: true,
            guarantee: [],
            strict: [],
        }, {
            name: 'inputting: non-empty array',
            input: [1, '2', false, String, { name: 1 }],
            check: true,
            guarantee: [1, '2', false, String, { name: 1 }],
            strict: [1, '2', false, String, { name: 1 }],
        }, {
            name: 'inputting: wrong type',
            inputs: [{}, Array, 1, false],
            check: false,
            guarantee: [],
            strict: [],
        }, {
            name: 'inputting: convertable 1',
            input: { a: '1', b: '2' },
            check: false,
            guarantee: ['1', '2'],
            strict: [],
        }, {
            name: 'inputting: convertable 2',
            input: new Set(['1', '2']),
            check: false,
            guarantee: ['1', '2'],
            strict: [],
        }, {
            name: 'inputting: convertable 3',
            input: '12',
            check: false,
            guarantee: ['1', '2'],
            strict: [],
        }],
    },
];
