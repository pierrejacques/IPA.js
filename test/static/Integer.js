Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = IPA => [
    {
        desc: 'When template = Integer',
        template: IPA.Integer,
        situations: [{
            name: 'inputting: int',
            input: 32,
            check: true,
            guarantee: 32,
            strict: 32,
        }, {
            name: 'inputting: convertable',
            inputs: ['12.3', '12', 12.3],
            check: false,
            guarantee: 12,
            strict: 0,
        }, ],
    }
]