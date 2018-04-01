Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = String',
        template: String,
        situations: [{
            name: 'inputting: string',
            input: 'test',
            check: true,
            guarantee: 'test',
        }, {
            name: 'inputting: empty string',
            input: '',
            check: true,
            guarantee: '',
        }, {
            name: 'inputting: number',
            input: 1,
            check: false,
            guarantee: '1',
        },]
    },
];
