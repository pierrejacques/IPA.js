Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = { name: String }',
        template: { name: String },
        situations: [{
            name: 'inputting: empty object',
            input: {},
            check: false,
            guarantee: { name: '' },
            strict: { name: '' },
        }, {
            name: 'inputting: right object',
            input: { name: 'jin', age: 12 },
            check: true,
            guarantee: { name: 'jin', age: 12 },
            strict: { name: 'jin', age: 12 },
        }, {
            name: 'inputting: almost right object',
            input: { name: 123, age: 12 },
            check: false,
            guarantee: { name: '123', age: 12 },
            strict: { name: '', age: 12 },
        }, {
            name: 'inputting: wrong types',
            inputs: [
                new Boolean(),
                new Array(),
                new Function(),
                new String(),
                new Number(),
                null,
                undefined,
                1,
                'a',
                true,
            ],
            check: false,
            guarantee: { name: '' },
            strict: { name: '' },
        }],
    },
    {
        desc: 'When template = { obj: { prop: Number } }',
        template: { obj: { prop: Number } },
        situations: [{
            name: 'inputting: right object',
            input: { obj: { prop: 12 } },
            check: true,
            guarantee: { obj: { prop: 12 } },
            strict: { obj: { prop: 12 } },
        }, {
            name: 'inputting: first layer error',
            input: {},
            check: false,
            guarantee: { obj: { prop: 0 } },
            strict: { obj: { prop: 0 } },
        }, {
            name: 'inputing: second layer error',
            input: { obj: [] },
            check: false,
            guarantee: { obj: { prop: 0 } },
            strict: { obj: { prop: 0 } },
        }],
    },
    {
        desc: 'When template = { required: Number, unrequired?: String }',
        template: { required: Number, 'unrequired?': String },
        situations: [{
            name: 'inputting: all provided',
            input: { required: 12, unrequired: '12' },
            check: true,
            guarantee: { required: 12, unrequired: '12' }, 
            strict: { required: 12, unrequired: '12' }, 
        }, {
            name: 'inputting: unrequired absent',
            input: { required: 12 },
            check: true,
            guarantee: { required: 12 }, 
            strict: { required: 12 },    
        }, {
            name: 'inputting: unrequired undefined',
            input: { required: 12, unrequired: undefined },
            check: true,
            guarantee: { required: 12, unrequired: undefined }, 
            strict: { required: 12, unrequired: undefined },      
        }, {
            name: 'inputting: unrequired null',
            input: { required: 12, unrequired: null },
            check: true,
            guarantee: { required: 12, unrequired: null }, 
            strict: { required: 12, unrequired: null },      
        }, {
            name: 'inputting: unrequired wrong',
            input: { required: 12, unrequired: 12 },
            check: false,
            guarantee: { required: 12, unrequired: '12' }, 
            strict: { required: 12, unrequired: '' },     
        }],
    },
    {
        desc: 'When template = { stillRequired\\?: Number }',
        template: { 'stillRequired\\?': Number },
        situations: [{
            name: 'inputting: right',
            input: { 'stillRequired?': 123 },
            check: true,
            guarantee: { 'stillRequired?': 123 },
            strict: { 'stillRequired?': 123 },
        }, {
            name: 'inputting: wrong',
            input: { 'stillRequired?': '123' },
            check: false,
            guarantee: { 'stillRequired?': 123 },
            strict: { 'stillRequired?': 0 },       
        }],
    },
    {
        desc: 'When template = { a: { a: { a: String}}}',
        template: { a: { a: { a: String}}},
        situations: [{
            name: 'right deep',
            input: { a: { a: { a: 'a' }}},
            check: true,
            guarantee: { a: { a: { a: 'a' }}},
            strict: { a: { a: { a: 'a' }}},
        }, {
            name: 'wrong type',
            input: { a: { a: { a: 1 }}},
            check: false,
            guarantee: { a: { a: { a: '1' }}},
            strict: { a: { a: { a: '' }}},
        }, {
            name: 'wrong structure',
            input: { a: { a: { b: 'a' }}},
            check: false,
            guarantee: { a: { a: { a: '', b: 'a' }}},
            strict: { a: { a: { a: '', b: 'a' }}},
        }]
    }
];
