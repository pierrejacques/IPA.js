Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = "23" (string default)',
        template: '23',
        situations: [{
            name: 'inputting: any string',
            input: 'as',
            check: true,
            guarantee: 'as',
            strict: 'as',
        }, {
            name: 'inputting: non-string',
            inputs: [12, true, {}, [], () => {}],
            check: false,
            guarantee: '23',
            strict: '23',
        }],
    },
];