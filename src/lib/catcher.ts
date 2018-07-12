import { IPAErrorCatcher, IPAErrorDict } from "../interface";

class Catcher implements IPAErrorCatcher {
    private _logMap: IPAErrorDict = {};
    private stack: Array<string> = [];
    private isFree: boolean = false;

    constructor() {
        this.clear();
    }

    clear(): void {
        this._logMap = {};
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
        let prefix = 'it';
        if (key === '') {
            prefix = 'itself';
        }
        this._logMap[`${prefix}${key}`] = msg;
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

    get hasLog() {
        return Object.keys(this._logMap).length > 0;
    }
}

export default new Catcher();
