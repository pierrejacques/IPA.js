Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        name: 'single string',
        template: String,
        cases: [{
            name: 'string',
            valid: true,
            data: '1',
            method: 'guarantee',
        }, {
            name: 'number',
            valid: false,
            data: 1,
            method: 'guarantee',
        }, {
            name: 'boolean',
            valid: false,
            data: false,
            method: 'guarantee',
        }, {
            name: 'null',
            valid: false,
            data: null,
            method: 'guarantee',
        }, {
            name: 'array',
            valid: false,
            data: [],
            method: 'guarantee',
        }]
    }, {
        name: 'single number',
        template: 1,
        cases: [{
            name: 'string',
            valid: false,
            data: '1',
            method: 'guarantee',
        }, {
            name: 'number',
            valid: true,
            data: 1,
            method: 'guarantee',
        }, {
            name: 'boolean',
            valid: false,
            data: false,
            method: 'guarantee',
        }, {
            name: 'null',
            valid: false,
            data: null,
            method: 'guarantee',
        }, {
            name: 'array',
            valid: false,
            data: [],
            method: 'guarantee',
        }]
    }, {
        name: 'Object',
        template: {
            x: [0, 'l'],
            y: ['', 'l'],
            z: Boolean,
        },
        cases: [{
            name: 'valid',
            valid: true,
            data: {
                x: [1, 2],
                y: ['1', '2'],
                z: true,
            },
            method: 'guarantee',
        }, {
            name: 'miss prop',
            valid: false,
            data: {
                x: [1, 2],
                y: ['1', '2'],
            },
            method: 'guarantee',
        }, {
            name: 'length wrong',
            valid: false,
            data: {
                x: [1, 2, 3],
                y: ['1', '2'],
                z: true,
            },
            method: 'guarantee',
        }, {
            name: '0 length',
            valid: true,
            data: {
                x: [],
                y: [],
                z: true,
            },
            method: 'guarantee',
        }]
    }
];
