Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        name: 'empty array template',
        template: [],
        cases: [{
            name: 'empty',
            data: [],
            method: 'check',
            result: true,
        }, {
            name: 'not array',
            data: {},
            method: 'check',
            result: false,
        }, {
            name: 'full array',
            data: [1,2,3,4,''],
            method: 'check',
            result: true,
        }]
    },
    {
        name: 'array with number',
        template: [Number],
        cases: [{
            name: 'empty',
            data: [],
            method: 'check',
            result: true,
        }, {
            name: 'number',
            data: [1, 2, 3],
            method: 'check',
            result: true,
        }, {
            name: 'string',
            data: ['1', '2', '3'],
            method: 'check',
            result: false,
        }, {
            name: 'hybrid1',
            data: [1, 2, '3'],
            method: 'check',
            result: false,
        }, {
            name: 'hybrid2',
            data: [1, 2, null],
            method: 'check',
            result: false,
        }, {
            name: 'hybrid3',
            data: [1, 2, undefined],
            method: 'check',
            result: false,
        }, {
            name: 'hybrid4',
            method: 'check',
            data: [1, 2, 3, { a: 4 }],
            result: false,
        }]
    }, {
        name: 'required array',
        template: [null],
        cases: [
            {
                name: 'empty',
                method: 'check',
                data: [], // key case!
                result: true,
            },
            {
                name: 'undefined',
                method: 'check',
                data: [undefined],
                result: false,
            },
            {
                name: 'undefined hybrid',
                method: 'check',
                data: [undefined, '1'],
                result: false,
            },
        ]
    }, {
        name: 'array const length',
        template: [null, 5],
        cases: [
            {
                name: 'empty',
                method: 'check',
                data: [],
                result: false,
            },
            {
                name: 'wrong length',
                method: 'check',
                data: [1,2,{}],
                result: false,
            },
            {
                name: 'right length',
                method: 'check',
                data: [1,2,3,4,5],
                result: true,
            }
        ]
    }, {
        name: 'object with arrays of same length',
        template: {
            x: [Number, 'l1'],
            b: [
                {
                    y: [Number, 'l1'],
                    name: String,
                },
                'l2'
            ],
            c: [String, 'l2'],
        },
        cases: [
            {
                name: 'right object',
                method: 'check',
                result: true,
                data: {
                    x: [1, 2, 3],
                    b: [{
                        y: [2, 3, 4],
                        name: 'y1',
                    }, {
                        y: [3, 4, 5],
                        name: 'y2',
                    }],
                    c: ['c1', 'c2']
                }
            },
            {
                name: 'wrong object1',
                method: 'check',
                result: false,
                data: {
                    x: [1, 2, 3],
                    b: [{
                        y: [2, 3, 4],
                        name: 'y1',
                    }, {
                        y: [3, 4, 5],
                        name: 'y2',
                    }],
                    c: 'as'
                }
            },
            {
                name: 'wrong object2',
                method: 'check',
                result: false,
                data: {
                    x: [1, 2, 3],
                    b: [{
                        y: [2, 3, 4],
                        name: 'y1',
                    }],
                    c: ['c1', 'c2']
                }
            },
            {
                name: 'wrong object3',
                method: 'check',
                result: false,
                data: {
                    x: [1, 2, 3],
                    b: [{
                        y: [2, 3],
                        name: 'y1',
                    }, {
                        y: [3, 4, 5],
                        name: 'y2',
                    }],
                    c: ['c1', 'c2']
                }
            },
        ]
    }
];
