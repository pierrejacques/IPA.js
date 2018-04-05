Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = true (boolean default)',
        template: true,
        situations: [{
            name: 'inputting: false',
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
    {
        desc: 'When template = false (boolean default)',
        template: false,
        situations: [{
            name: 'inputting: false',
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
            guarantee: false,
            strict: false,
        }],
    },
];
