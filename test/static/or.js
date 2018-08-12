Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = IPA => [
    {
        desc: 'When template = or(String, Number)',
        template: IPA.or(String, Number),
        situations: [{
            name: 'inputting: string',
            input: '123',
            check: true,
            guarantee: '123',
            strict: '123',
        }, {
            name: 'inputting: number',
            input: 32,
            check: true,
            guarantee: 32,
            strict: 32,
        }],
    }
]