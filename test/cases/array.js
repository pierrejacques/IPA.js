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
        }, {
            name: 'inputting: non-empty array',
            input: [1, '2', false, String, { name: 1 }],
            check: true,
            guarantee: [1, '2', false, String, { name: 1 }],
        }, {
            name: 'inputting: wrong type',
            inputs: [{}, Array, 1, false],
            check: false,
            guarantee: [],
        }, {
            name: 'inputting: convertable',
            inputs: [{ a: '1', b: '2' }, new Set(['1', '2']), '12'],
            check: false,
            guarantee: ['1', '2'],
        }],
    },
];
