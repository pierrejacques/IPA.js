Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = IPA => [
    {
        desc: 'When template = From(null, {a:1}, "--", 1)',
        template: IPA.From(null, { a: 1 }, "--", 1),
        situations: [{
            name: 'inputting: right obj',
            input: { a: 1 },
            check: true,
            guarantee: { a: 1 },
            strict: { a: 1 },
        }, {
            name: 'inputting: null',
            input: null,
            check: true,
            guarantee: null,
            strict: null,
        }],
    },
]