Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        name: 'mock single number',
        template: Number,
        cases: [{
            name: 'number',
            data: {},
            method: 'mock',
            time: 100,
        }]
    },
    {
        name: 'mock single boolean',
        template: Boolean,
        cases: [{
            name: 'boolean',
            data: {},
            method: 'mock',
            time: 10,
        }]
    },
    {
        name: 'mock single string',
        template: String,
        cases: [{
            name: 'string',
            data: {},
            method: 'mock',
            time: 100,
        }]
    },
    {
        name: 'mock array1',
        template: [],
        cases: [{
            name: 'array1',
            data: {},
            method: 'mock',
            time: 10,
        }]
    },
    {
        name: 'mock array2',
        template: Array,
        cases: [{
            name: 'array2',
            data: {},
            method: 'mock',
            time: 10,
        }]
    },
    {
        name: 'mock array3',
        template: [String],
        cases: [{
            name: 'array string',
            data: {},
            method: 'mock',
            time: 10,
        }]
    },
    {
        name: 'mock array4',
        template: [Number],
        cases: [{
            name: 'array number',
            data: {},
            method: 'mock',
            time: 10,
        }]
    },
    {
        name: 'mock array5',
        template: [Boolean],
        cases: [{
            name: 'array boolean',
            data: {},
            method: 'mock',
            time: 10,
        }]
    },
    {
        name: 'mock array with object & length',
        template: [{
            a: [Number, 'l1'],
            b: [String, 'l1'],
        }, 'l2'],
        cases: [{
            name: 'array object & length free',
            data: {},
            method: 'mock',
            time: 10,
        }, {
            name: 'array object & length configed',
            data: { l1: 10, l2: 20 },
            method: 'mock',
            time: 10,
        }]
    },
    {
        name: 'mock deep object',
        template: {
            x: [{
                z: [Number, 'l2'],
                w: String,
            }, 'l1'],
            y: [Number, 'l1'],
            a: {
                b: [{
                    c: String,
                    d: Number,
                }, 'l2']
            },
            is: [Boolean, 6],
        },
        cases: [{
            name: 'non config',
            data: {},
            method: 'mock',
            time: 10,
        }, {
            name: 'config partially',
            data: { l1: 20 },
            method: 'mock',
            time: 10,
        }, {
            name: 'config fully',
            data: { l1: 20, l2: 10 },
            method: 'mock',
            time: 10,
        }]
    }
];
