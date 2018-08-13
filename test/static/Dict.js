Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = IPA => [
    {
        desc: 'When template = Dict(Number)',
        template: IPA.Dict(Number),
        situations: [{
            name: 'inputting: right object',
            input: {a:1,b:2,c:3},
            check: true,
            guarantee: {a:1,b:2,c:3},
            strict: {a:1,b:2,c:3},
        }, {
            name: 'inputting: non Object',
            inputs: [0, 'str', () => {}, []],
            check: false,
            guarantee: {},
            strict: {},
        }, {
            name: 'inputting: partial right',
            input: {a:1,b:'123'},
            check: false,
            guarantee: {a:1,b:123},
            strict: {a:1,b:0},
        }],
    }
]