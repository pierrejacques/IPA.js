Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = [Number]',
        template: [Number],
        situations: [{
            name: 'inputting: right array',
            input: [1, 3, 5],
            check: true,
            guarantee: [1, 3, 5],
            strict: [1, 3, 5],
        }, {
            name: 'inputting: empty array',
            input: [],
            check: true,
            guarantee: [],
            strict: [],
        }, {
            name: 'inputting: wrong but transable',
            inputs: ['135', false, () => {}],
            check: false,
            guarantee: [],
            strict: [],
        }],
    },
    {
        desc: 'When template = [null, 3]',
        template: [null, '3'],
        situations: [{
            name: 'inputting: right length',
            input: [1, 'str', false],
            check: true,
            guarantee: [1, 'str', false],
            strict: [1, 'str', false],
        }, {
            name: 'inputting: too long',
            input: [1, 'str', false, () => {}],
            check: false,
            guarantee: [1, 'str', false],
            strict: [1, 'str', false],
        }, {
            name: 'inputting: too short',
            input: [1, 'str'],
            check: false,
            guarantee: [1, 'str', null],
            strict: [1, 'str', null],
        }],
    },
    {
        desc: 'When template = [null, "==3"]',
        template: [null, '==3'],
        situations: [{
            name: 'inputting: right length',
            input: [1, 'str', false],
            check: true,
            guarantee: [1, 'str', false],
            strict: [1, 'str', false],
        }, {
            name: 'inputting: too long',
            input: [1, 'str', false, () => {}],
            check: false,
            guarantee: [1, 'str', false],
            strict: [1, 'str', false],
        }, {
            name: 'inputting: too short',
            input: [1, 'str'],
            check: false,
            guarantee: [1, 'str', null],
            strict: [1, 'str', null],
        }],
    },
    {
        desc: 'When template = [undefined, "<3"]',
        template: [undefined, '<3'],
        situations: [{
            name: 'inputting: right length',
            input: [1, 'str'],
            check: true,
            guarantee: [1, 'str'],
            strict: [1, 'str'],
        }, {
            name: 'inputting: too long',
            input: [1, 'str', false],
            check: false,
            guarantee: [1, 'str'],
            strict: [1, 'str'],
        }, {
            name: 'inputting: shorter',
            input: [1],
            check: true,
            guarantee: [1],
            strict: [1],
        }],
    },
    {
        desc: 'When template = [undefined, "<=3"]',
        template: [undefined, '<=3'],
        situations: [{
            name: 'inputting: right length',
            input: [1, 'str', 2],
            check: true,
            guarantee: [1, 'str', 2],
            strict: [1, 'str', 2],
        }, {
            name: 'inputting: too long',
            input: [1, 'str', false, true],
            check: false,
            guarantee: [1, 'str', false],
            strict: [1, 'str', false],
        }, {
            name: 'inputting: shorter',
            input: [1],
            check: true,
            guarantee: [1],
            strict: [1],
        }],
    },
    {
        desc: 'When template = [undefined, ">3"]',
        template: [undefined, '>3'],
        situations: [{
            name: 'inputting: right length',
            input: [1, 'str', 2, false],
            check: true,
            guarantee: [1, 'str', 2, false],
            strict: [1, 'str', 2, false],
        }, {
            name: 'inputting: too short',
            input: [1, 'str', false],
            check: false,
            guarantee: [1, 'str', false, undefined],
            strict: [1, 'str', false, undefined],
        }, {
            name: 'inputting: longer',
            input: [1, 1, 1, 1, 1],
            check: true,
            guarantee: [1, 1, 1, 1, 1],
            strict: [1, 1, 1, 1, 1],
        }],
    },
    {
        desc: 'When template = {a:[Number, "l"], b:[String, "l"]}',
        template: {a:[Number, "l"], b:[String, "l"]},
        situations: [{
            name: 'inputting: length matched',
            input: {a:[1, 2, 3],b:['str1', 'str2', 'str3']},
            check: true,
            guarantee: {a:[1, 2, 3],b:['str1', 'str2', 'str3']},
            strict: {a:[1, 2, 3],b:['str1', 'str2', 'str3']},
        }, {
            name: 'inputting: length unmatched',
            input: {a:[1, 2, 3],b:['str1', 'str2']},
            check: false,
            guarantee: {a:[1, 2],b:['str1', 'str2']},
            strict: {a:[1, 2],b:['str1', 'str2']},
        }],
    },
    {
        desc: 'When template = [[0, "l"]]',
        template: [[0, "l"]],
        situations: [{
            name: 'strategy: shortest',
            inputs: [
                [[1, 2, 3], [1, 2], [1, 2, 3]],
                [[1, 2], [1, 2], [1, 2, 3]]
            ],
            strategy: 'shortest',
            check: false,
            guarantee: [[1, 2], [1, 2], [1, 2]],
            strict: [[1, 2], [1, 2], [1, 2]],
        }, {
            name: 'strategy: average',
            input: [[1, 2, 3], [], [1, 2, 3]],
            strategy: 'average',
            check: false,
            guarantee: [[1, 2], [0, 0], [1, 2]],
            strict: [[1, 2], [0, 0], [1, 2]],
        }, {
            name: 'strategy: longest',
            input: [[1, 2, 3], [1], [1, 2]],
            strategy: 'longest',
            check: false,
            guarantee: [[1, 2, 3], [1, 0, 0], [1, 2, 0]],
            strict: [[1, 2, 3], [1, 0, 0], [1, 2, 0]],
        }, {
            name: 'strategy: most',
            input: [[1, 2, 3], [1, 2], [1, 2, 3], [1, 2], [1, 2]],
            strategy: 'most',
            check: false,
            guarantee: [[1, 2], [1, 2], [1, 2], [1, 2], [1, 2]],
            strict: [[1, 2], [1, 2], [1, 2], [1, 2], [1, 2]],
        }]
    },
];