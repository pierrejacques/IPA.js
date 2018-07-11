import { IPAErrorCatcher } from "../interface";

class Catcher implements IPAErrorCatcher {
    private _logMap: Map<string, string> = new Map();
    private stack: Array<string> = [];

    constructor() {}

    clear(): void {
        this._logMap.clear();
        this.stack = [];
    }

    pop() {
        this.stack.pop();
    }

    push(key: any) {
        const keyStr = typeof key === 'string' ? `.${key}` : `[${key}]`;
        this.stack.push(keyStr);
    }

    catch(msg: string, result: boolean = false) {
        if (!result) {
            this._logMap.set(this.stack.join(''), `should be ${msg}`);
        }
        return result;
    }

    wrap(key, getResult) {
        this.push(key);
        const result = getResult();
        this.pop();
        return result;
    }

    get logMap() {
        return this._logMap;
    }
}

export default new Catcher();
