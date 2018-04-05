Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = 23 (number default)',
        template: 23,
        situations: [{
            name: 'inputting: any number',
            input: 34,
            check: true,
            guarantee: 34,
            strict: 34,
        }, {
            name: 'inputting: other',
            inputs: ['34', true, () => {}, [], {}],
            check: false,
            guarantee: 23,
            strict: 23,
        }],
    },
];