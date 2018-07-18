import { isInteger, random, toInteger } from 'lodash';

export default ({ catcher }) => ({
    check: v => catcher.catch('an integer', isInteger(v)),
    guarantee(v, strict) {
        return this.check(v) ? v : strict ? 0 : toInteger(v);
    },
    mock: prod => prod ? 0 : random(0, 100),
});
