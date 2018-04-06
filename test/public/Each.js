Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = IPA => [
    {
        desc: 'When template = Each([Number, String, Boolean])',
        template: IPA.Each([Number, String, Boolean]),
        situations: [{
            name: 'inputting: right',
            input: [1, '1', true],
            check: true,
            guarantee: [1, '1', true],
            strict: [1, '1', true],
        }, {
            name: 'inputting: wrong',
            input: [1, 1, 1],
            check: false,
            guarantee: [1, '1', true],
            strict: [1, '', false],
        }, {
            name: 'inputting: long',
            input: [1, '1', true, 'any'],
            check: false,
            guarantee: [1, '1', true],
            strict: [1, '1', true],
        }],
    },
    {
        desc: 'When template = Each([Number, String, Boolean], false)',
        template: IPA.Each([Number, String, Boolean], false),
        situations: [{
            name: 'inputting: long',
            input: [1, '1', true, 'any'],
            check: true,
            guarantee: [1, '1', true, 'any'],
            strict: [1, '1', true, 'any'],
        }],
    },
]