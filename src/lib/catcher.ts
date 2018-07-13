import { IPAErrorCatcher, IPAErrorDict } from "../interface";
import IPALike from "./ipa-like";

class Catcher implements IPAErrorCatcher {
    private user: IPALike = null;
    private _logMap: IPAErrorDict = {};
    private stack: Array<string> = [];
    private isFree: boolean = false;

    constructor() {}

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

    log(suffix: string, msg: string) {
        if (this.isFree) return;
        const key = `input${suffix}`;
        if (this._logMap[key]) {
            this._logMap[key] += ` && ${msg}`;
        } else {
            this._logMap[key] = msg;
        }
    }

    free(callback) {
        this.isFree = true;
        const result = callback();
        this.isFree = false;
        return result;
    }

    subscribe(instance: IPALike) {
        if (!this.user) {
            this.user = instance;
        }
    }

    isUsedBy(instance: IPALike) {
        return instance === this.user;
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
