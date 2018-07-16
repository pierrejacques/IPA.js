Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = IPA => [
    {
        desc: 'When template = recurse({ key: "$$" })',
        template: IPA.recurse({ key: '$$' }),
        situations: [{
            name: 'inputting: right recursive object',
            input: { key: { key: { key: null }}},
            check: true,
            guarantee: { key: { key: { key: null }}},
            strict: { key: { key: { key: null }}},
        }, {
            name: 'inputting: false recursive object',
            input: { key: [] },
            check: false,
            guarantee: { key: { key: null }},
            
        }],
    }
]