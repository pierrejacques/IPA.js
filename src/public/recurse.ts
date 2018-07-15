import { random } from 'lodash';
import From from "./From";

export default (subTemplate: any, options: { marker: string, allow: any }) => ({ compile, cache }) => {
    const { marker = '$$', allow = From(null) } = options || {};
    const allowed = compile(allow);
    let compiled = null;
    const asset = {
        check: v => allowed.check.call(allowed, v) || compiled.check.call(compiled, v),
        guarantee(v) {
            return this.check(v) ? v : compiled.guarantee.call(compiled, v);
        },
        mock: () => random(1) === 0 ? allowed.mock.call(allowed) : compiled.mock.call(compiled),
    };
    cache.set('$$recurseScope', {
        marker,
        asset,
    });
    compiled = compile(subTemplate);
    cache.delete('$$recurseScope');
    return compiled;
}
