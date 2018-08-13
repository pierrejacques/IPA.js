Object.defineProperty(exports, "__esModule", {
    value: true
});

const doubleRecurse = [{
    name: 'test',
    children: [{
        name: 'test',
        children: null,
        subRecurse: [{
            name: 'test',
            children: [{
                name: 'children',
                children: null,
            }],
        }],
    }],
    subRecurse: [{
        name: 'asddd',
        children: null,
    }],
}];

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
            input: { key: { key: { key: [] }}},
            check: false,
            guarantee: { key: { key: { key: null}}},
            strict: { key: { key: { key: null}}}, 
        }],
    }, {
        desc: 'When Recurse in Recurse',
        template: IPA.recurse([{
            name: String,
            children: '$$',
            subRecurse: IPA.recurse([{
                name: String,
                children: '$$',
            }]),
        }]),
        situations: [{
            name: 'inputting: right object',
            input: doubleRecurse,
            check: true,
            guarantee: doubleRecurse,
            strict: doubleRecurse,
        }],
    }
]