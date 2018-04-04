Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        desc: 'When template = Boolean',
        template: Boolean,
        situations: [{
            name: 'inputting: boolean',
            input: false,
            check: true,
            guarantee: false,
            strict: false,
        }, {
            name: 'inputting: to true',
            inputs: [
                10,
                -1,
                'as',
                {},
                [],
                () => {}
            ],
            check: false,
            guarantee: true,
            strict: true,
        }, {
            name: 'inputting: to false',
            inputs: [
                '',
                0,
                null,
                undefined,
            ],
            check: false,
            guarantee: false,
            strict: false,
        }]
    },
];
