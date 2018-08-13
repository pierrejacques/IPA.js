Object.defineProperty(exports, "__esModule", {
    value: true
});

class Person {
    constructor(fn, ln) {
        this.fn = fn;
        this.ln = ln;
    }
}

const p1 = new Person('John', 'Doe');
const p2 = { fn: 'Pierre', ln: 'Jacques' };

module.exports = IPA => [
    {
        desc: 'When template = asClass(Person, "John", "Doe")',
        template: IPA.asClass(Person, 'John', 'Doe'),
        situations: [{
            name: 'inputting: right person',
            input: p1,
            check: true,
            guarantee: p1,
            strict: p1,
        }, {
            name: 'inputting: wrong person',
            input: p2,
            check: false,
            guarantee: p1,
            strict: p1,
        }],
    }
]