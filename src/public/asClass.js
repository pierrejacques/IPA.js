import { isFunction } from 'lodash';

export default (cls) => {
    if (!isFunction(cls)) throw new Error('function "asClass" only accept constructor function as parameter');
    return () => ({
        check: v => v instanceof cls,
        guarantee: v => v instanceof cls ? v : new cls(),
        mock: () => new cls(),
    })
}