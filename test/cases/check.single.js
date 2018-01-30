Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        name: "single string",
        template: String,
        cases: [{
                name: "string",
                data: '1',
                result: true,
                method: 'check',
            }, {
                name: "number1",
                data: 1,
                result: false,
                method: 'check',
            }, {
                name: "number2",
                data: 0,
                result: false,
                method: 'check',
            }, {
                name: "number3",
                data: 100,
                result: false,
                method: 'check',
            }, {
                name: "object",
                data: {},
                result: false,
                method: 'check',
            }, {
                name: "array",
                data: [],
                result: false,
                method: 'check',
            }, {
                name: "undefined",
                data: undefined,
                result: false,
                method: 'check',
            }, {
                name: "null",
                data: null,
                result: false,
                method: 'check',
            }, {
                name: "boolean",
                data: true,
                result: false,
                method: 'check',
            }]
    },
    {
        name: "single number",
        template: Number,
        cases: [{
                name: "string",
                data: '1',
                result: false,
                method: 'check',
            }, {
                name: "number",
                data: 1,
                result: true,
                method: 'check',
            }, {
                name: "object",
                data: {},
                result: false,
                method: 'check',
            }, {
                name: "array",
                data: [],
                result: false,
                method: 'check',
            }, {
                name: "undefined",
                data: undefined,
                result: false,
                method: 'check',
            }, {
                name: "null",
                data: null,
                result: false,
                method: 'check',
            }, {
                name: "boolean",
                data: true,
                result: false,
                method: 'check',
            }]
    },
    {
        name: "single boolean",
        template: Boolean,
        cases: [
            {
                name: "string",
                data: '1',
                result: false,
                method: 'check',
            },
            {
                name: "number",
                data: 1,
                result: false,
                method: 'check',
            },
            {
                name: "object",
                data: {},
                result: false,
                method: 'check',
            },
            {
                name: "array",
                data: [],
                result: false,
                method: 'check',
            },
            {
                name: "undefined",
                data: undefined,
                result: false,
                method: 'check',
            },
            {
                name: "null",
                data: null,
                result: false,
                method: 'check',
            },
            {
                name: "boolean",
                data: true,
                result: true,
                method: 'check',
            },
            {
                name: "boolean",
                data: false,
                result: true,
                method: 'check',
            },
        ]
    },
    {
        name: "single array",
        template: [Number],
        cases: [
            {
                name: "string",
                data: '1',
                result: false,
                method: 'check',
            },
            {
                name: "number",
                data: 1,
                result: false,
                method: 'check',
            },
            {
                name: "object",
                data: {},
                result: false,
                method: 'check',
            },
            {
                name: "array",
                data: [],
                result: true,
                method: 'check',
            },
            {
                name: "undefined",
                data: undefined,
                result: false,
                method: 'check',
            },
            {
                name: "null",
                data: null,
                result: false,
                method: 'check',
            },
            {
                name: "boolean",
                data: true,
                result: false,
                method: 'check',
            },
        ]
    },
    {
        name: "single array2",
        template: Array,
        cases: [
            {
                name: "string",
                data: '1',
                result: false,
                method: 'check',
            },
            {
                name: "number",
                data: 1,
                result: false,
                method: 'check',
            },
            {
                name: "object",
                data: {},
                result: false,
                method: 'check',
            },
            {
                name: "array",
                data: [1,2],
                result: true,
                method: 'check',
            },
            {
                name: "undefined",
                data: undefined,
                result: false,
                method: 'check',
            },
            {
                name: "null",
                data: null,
                result: false,
                method: 'check',
            },
            {
                name: "boolean",
                data: true,
                result: false,
                method: 'check',
            },
        ]
    },
    {
        name: "single object",
        template: {},
        cases: [
            {
                name: "string",
                data: '1',
                result: false,
                method: 'check',
            },
            {
                name: "number",
                data: 1,
                result: false,
                method: 'check',
            },
            {
                name: "object",
                data: {},
                result: true,
                method: 'check',
            },
            {
                name: "array",
                data: [],
                result: false,
                method: 'check',
            },
            {
                name: "undefined",
                data: undefined,
                result: false,
                method: 'check',
            },
            {
                name: "null",
                data: null,
                result: false,
                method: 'check',
            },
            {
                name: "boolean",
                data: true,
                result: false,
                method: 'check',
            },
        ]
    },
    {
        name: "single object2",
        template: Object,
        cases: [
            {
                name: "string",
                data: '1',
                result: false,
                method: 'check',
            },
            {
                name: "number",
                data: 1,
                result: false,
                method: 'check',
            },
            {
                name: "object",
                data: {},
                result: true,
                method: 'check',
            },
            {
                name: "array",
                data: [],
                result: false,
                method: 'check',
            },
            {
                name: "undefined",
                data: undefined,
                result: false,
                method: 'check',
            },
            {
                name: "null",
                data: null,
                result: false,
                method: 'check',
            },
            {
                name: "boolean",
                data: true,
                result: false,
                method: 'check',
            },
        ]
    },
    {
        name: "single required",
        template: null,
        cases: [
            {
                name: "string",
                data: '1',
                result: true,
                method: 'check',
            },
            {
                name: "number",
                data: 1,
                result: true,
                method: 'check',
            },
            {
                name: "object",
                data: {},
                result: true,
                method: 'check',
            },
            {
                name: "array",
                data: [],
                result: true,
                method: 'check',
            },
            {
                name: "undefined",
                data: undefined,
                result: false,
                method: 'check',
            },
            {
                name: "null",
                data: null,
                result: true,
                method: 'check',
            },
            {
                name: "boolean",
                data: true,
                result: true,
                method: 'check',
            },
        ]
    },
    {
        name: 'single custom',
        template: val => {
            if (val && val.length === 10) {
                return { isValid: true };
            }
            return { isValid: false };
        },
        cases: [
            {
                name: 'null',
                data: null,
                result: false,
                method: 'check',
            },
            {
                name: 'undefined',
                data: undefined,
                result: false,
                method: 'check',
            },
            {
                name: 'array false',
                data: [],
                result: false,
                method: 'check',
            },
            {
                name: 'array true',
                data: [1,2,3,4,5,6,7,8,9,10],
                result: true,
                method: 'check',
            },
            {
                name: 'string false',
                data: 'asd',
                result: false,
                method: 'check',
            },
            {
                name: 'string true',
                data: 'asdfghjklq',
                result: true,
                method: 'check',
            },
            {
                name: 'object true',
                data: { length: 10 },
                result: true,
                method: 'check',
            }
        ]
    }
];
