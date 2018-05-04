Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = IPA => [
    {
        desc: 'When template = IPA.assemble(Number, IPA.Integer, IPA.Range(10, 40))',
        template: IPA.assemble(Number, IPA.Integer, IPA.Range(10, 40)),
        situations: [{
            name: 'inputting: float',
            input: 123.12,
            check: true,
            guarantee: 123,
            strict: 0,
        }],
    }
];