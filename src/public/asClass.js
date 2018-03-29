import { isFunction } from 'lodash';

export default (Cls, ...params) => {
    if (!isFunction(Cls)) throw new Error('function "asClass" only accept constructor function as 1st parameter');
    try {
        new Cls(...params); // eslint-disable-line
    } catch (e) {
        throw new Error('in function "as Class", class(1st param) must match with the params(the rest params)');
    }
    return () => ({
        check: v => v instanceof Cls,
        guarantee: v => (v instanceof Cls ? v : new Cls(...params)),
        mock: () => new Cls(...params),
    });
};
