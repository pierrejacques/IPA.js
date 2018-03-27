const IPA = require('../dist/ipa.js');
const { Enum } = IPA;

// class Person {
//     constructor(name) {
//         if (name === undefined) {
//             throw new Error('asd');
//         }
//         this.name = name;
//     }

//     show() {
//         console.log(this.name);
//     }
// }

// const p1 = new Person('Jack');
// const p2 = {
//     name: 'Johnson',
// };

// const personChecker = new IPA(asClass(Person, 'John'));

// console.log(personChecker.mock());

const en = new IPA(Enum([123, 234, { a: 1 }]));