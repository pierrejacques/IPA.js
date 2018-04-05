Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = 23 (number default)',
        template: 23,
        situations: [{
            name: 'inputting: any number',
            input: false,
            check: true,
            guarantee: false,
            strict: false,
        }, {
            name: 'inputting: true',
            input: true,
            check: true,
            guarantee: true,
            strict: true,
        }, {
            name: 'inputting: non-boolean',
            inputs: [1, 'a', {}, [], () => {}],
            check: false,
            guarantee: true,
            strict: true,
        }],
    },
];