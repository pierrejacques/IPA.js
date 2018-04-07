const IPA = require('../dist/ipa.js');

const { Range, Integer } = IPA;

const and = (...templates) => {
    return (compile) => {
        const rules = templates.map(template => compile(template));
        return {
            check(val) {
                return rules.filter(rule => rule.check(val) === false).length === 0;
            } 
        }
    }
}

const schema = new IPA(and(Range(100, 110), Integer));

console.log(schema.check(104.1))
console.log(schema.guarantee(104.1));