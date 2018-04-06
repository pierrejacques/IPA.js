Object.defineProperty(exports, "__esModule", {
    value: true
});

module.exports = IPA => [
    {
        desc: 'When template = [new IPA({ name: String, value: Number })]',
        template: [new IPA({
            name: String,
            value: Number,
        })],
        situations: [{
            name: 'inputting: right struct',
            input: [{name:'str1',value:1},{name:'str2',value:2}],
            check: true,
            guarantee: [{name:'str1',value:1},{name:'str2',value:2}],
            strict: [{name:'str1',value:1},{name:'str2',value:2}],
        }, {
            name: 'inputting: wrong struct',
            input: [{name:'str1',value:1},{name:123,value:2}],
            check: false,
            guarantee: [{name:'str1',value:1},{name:'123',value:2}],
            strict: [{name:'str1',value:1},{name:'',value:2}],
        }],
    }
];
