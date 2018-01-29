Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = [
    {
        name: 'deepObject',
        template: {
            a: {
                b: {
                    c: {
                        d: Array,
                        e: Number,
                    }
                }
            }
        },
        cases: [
            {
                name: 'right Object',
                data: {
                    a: {
                        b: {
                            c: {
                                d: [1,2,3],
                                e: 2,
                            }
                        }
                    }
                },
                result: true,
                method: 'check',
            },
            {
                name: 'wrong Object',
                data: {
                    a: {
                        b: {
                            c: {
                                d: null,
                                e: 2,
                            }
                        }
                    }
                },
                result: false,
                method: 'check',
            }
        ]
    },
]
