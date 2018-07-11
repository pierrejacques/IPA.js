import { IPAErrorCatcher } from "../interface";

class Catcher implements IPAErrorCatcher {
    private _logMap: Map<string, string> = new Map();
    private stack: Array<string> = [];
    private isFree: boolean = false;

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
            this.log(this.currentKey, `should be ${msg}`);
        }
        return result;
    }

    wrap(key, getResult) {
        this.push(key);
        const result = getResult();
        this.pop();
        return result;
    }

    log(key: string, msg: string) {
        if (this.isFree) return;
        this._logMap.set(`itself${key}`, msg);
    }

    free(callback) {
        this.isFree = true;
        const result = callback();
        this.isFree = false;
        return result;
    }

    get logMap() {
        return this._logMap;
    }

    get currentKey() {
        return this.stack.join('');    
    }
}

export default new Catcher();
