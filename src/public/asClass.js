import { isFunction } from 'lodash';

export default (cls, ...params) => {
    if (!isFunction(cls)) throw new Error('function "asClass" only accept constructor function as 1st parameter');
    try {
        new cls(...params);
    } catch(e) {
        throw new Error('in function "as Class", class(1st param) must match with the params(the rest params)')
    }
    return () => ({
        check: v => v instanceof cls,
        guarantee: v => v instanceof cls ? v : new cls(...params),
        mock: () => new cls(...params),
    })
}