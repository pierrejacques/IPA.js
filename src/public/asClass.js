import { isFunction } from 'lodash';

export default (Cls, ...params) => {
    if (!isFunction(Cls)) throw new Error('in function "asClass": 1st parameter must be a class');
    try {
        new Cls(...params); // eslint-disable-line
    } catch (e) {
        throw new Error('in function "asClass": class unmatched with params');
    }
    return () => ({
        check: v => v instanceof Cls,
        guarantee: v => (v instanceof Cls ? v : new Cls(...params)),
        mock: () => new Cls(...params),
    });
};
