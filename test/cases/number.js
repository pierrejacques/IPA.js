Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = Number',
        template: Number,
        situations: [{
            name: 'inputting: number',
            input: 10,
            check: true,
            guarantee: 10,
        }, {
            name: 'inputting: string',
            input: '10',
            check: false,
            guarantee: 10,
        }, {
            name: 'inputting: boolean',
            input: true,
            check: false,
            guarantee: 1,
        }, {
            name: 'inputting: others',
            inputs: [[], {}, () => {}],
            check: false,
            guarantee: 0,
        }]
    },
];
