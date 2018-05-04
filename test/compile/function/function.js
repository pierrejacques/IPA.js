Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = Function',
        template: Function,
        situations: [{
            name: 'inputting: func',
            input: () => {},
            check: true,
            guarantee: () => {},
            strict: () => {},
        }, {
            name: 'inputting: non func',
            input: {},
            check: false,
            guarantee: () => {},
            strict: () => {},
        }],
    },
];
