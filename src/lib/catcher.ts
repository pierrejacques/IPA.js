import { IPAErrorCatcher, IPAExceptions, IPAErrorLog } from "../interface";
import callers from './callers';

let exceptions: IPAExceptions = {};
let stack: Array<string> = [];
let isFree: boolean = false;

function match(key: string, deepKey: string): boolean {
    const result = key.indexOf(deepKey);
    const len = deepKey.length;

    return key === deepKey || (
        result === 0 &&
        /[.\[]/.test(key[len])
    );
}
class IPAError implements IPAErrorLog {
    constructor(
        public method: string,
        public exceptions: IPAExceptions,
        public input: any
    ) {}
    
    has(deepKey) {
        return Object.keys(this.exceptions).some(key => match(key, `input${deepKey}`));
    }

    stopPropagation() {
        catcher.clear();
    }
}

const catcher: IPAErrorCatcher = {
    clear() {
        if (callers.root === callers.current) {
            exceptions = {};
            stack = [];
        }
    },

    pop() {
        stack.pop();
    },

    push(key: any) {
        const keyStr = typeof key === 'string' ? `.${key}` : `[${key}]`;
        stack.push(keyStr);
    },

    catch(msg: string, result: boolean = false) {
        if (!result) {
            this.log(this.currentKey, `should be ${msg}`);
        }
        return result;
    },

    wrap(key, getResult) {
        this.push(key);
        const result = getResult();
        this.pop();
        return result;
    },

    log(suffix: string, msg: string) {
        if (isFree) return;
        const key = `input${suffix}`;
        if (exceptions[key]) {
            exceptions[key] += ` && ${msg}`;
        } else {
            exceptions[key] = msg;
        }
    },

    free(callback) {
        isFree = true;
        const result = callback();
        isFree = false;
        return result;
    },

    getError(method: string, input: any) {
        if (callers.root !== callers.current) return null;
        return Object.keys(exceptions).length ? new IPAError(
            method,
            exceptions,
            input,
        ) : null;
    },

    get currentKey() {
        return stack.join('');    
    },
}

export default catcher;
