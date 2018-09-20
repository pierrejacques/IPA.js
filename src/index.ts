import { IPACore, IPAStrategy, IPACompileFunction, IPAErrorSubscriber, IPAGuaranteeOptions, IPACache, IPAErrorCatcher, IPAExtender } from './interface';

import { cloneDeep, isPlainObject, isFunction, and } from './lib/_';
import callers from './lib/callers';
import catcher from './lib/catcher';
import cache from './lib/cache';
import lengthManager from './lib/length-manager';
import { IPALike, IPAProxy } from './lib/peer-classes';
import compile from './compile';
import {
    asClass,
    assemble,
    Dict,
    Each,
    From,
    Integer,
    or,
    Range,
    recurse,
} from './static';

let errorHandler: IPAErrorSubscriber = null;
const instances: Map<any, IPA> = new Map();
const clear = (instance?: IPA, method?: string, input?: any) => {
    let errorLog = catcher.getError(method, input);
    errorLog && instance.errorHandler && instance.errorHandler(errorLog);
    errorLog = catcher.getError(method, input);
    errorLog && errorHandler && errorHandler(errorLog);
    cache.clear();
    catcher.clear();
    callers.pop();
};

class IPA extends IPALike {
    // environment

    public static isProductionEnv: boolean = false;

    // global types
    public static define = (name: any, template: any): boolean => {
        if (instances.has(name)) return false;
        const instance = new IPA(template);
        instances.set(name, instance);
        return true;
    };
    public static Type = (name: any): IPALike => {
        let i = null;
        return new IPAProxy(() => {
            if (i) return i;
            i = instances.get(name);
            return i || new IPA(undefined);
        });
    };

    // functional
    public static compile: IPACompileFunction = compile;
    public static cache: IPACache = cache;
    public static cacther: IPAErrorCatcher = catcher;
    
    // global errorHandler
    public static onError = (f: IPAErrorSubscriber) => {
        errorHandler = f;
        return IPA;
    };

    // extensions
    public static asClass = asClass;
    public static assemble = assemble;
    public static Dict = Dict;
    public static Each = Each;
    public static From = From;
    public static Integer = Integer;
    public static or = or;
    public static Range = Range;
    public static recurse = recurse;
    public static use = (extender: IPAExtender) => {
        extender(IPA);
    }

    // appearence
    public static toString = (): string => 'IPA runtime type validator';

    // instance errorHandler
    public errorHandler: IPAErrorSubscriber = null;
    public core: IPACore = null;
    public strategy: IPAStrategy = IPAStrategy.Shortest;

    constructor(template: any) {
        super();
        this.core = compile(template);
    }

    check(data, onError?: IPAErrorSubscriber) {
        callers.push(this);
        const output = and(this.core.check(data), lengthManager.check());
        const errorLog = catcher.getError('check', data);
        errorLog && onError && onError(catcher.getError('check', data));
        clear(this, 'check', data);
        return output;
    }

    /**
     * @param {the inputting data to be guaranteed} data
     * @param {guarantee Options} isCopy
     * @param {method level errorHandler} onError
     */
    guarantee(data, options?: IPAGuaranteeOptions | IPAErrorSubscriber, onError?: IPAErrorSubscriber) {
        let opt, onErr;
        if (isPlainObject(options)) {
            opt = options;
            onErr = onError;
        } else {
            onErr = options;
        }
        const { copy: isCopy, strict: isStrict } = Object.assign({
            copy: true,
            strict: false,
        }, opt || {});

        callers.push(this);
        const copy = isCopy ? cloneDeep(data) : data;
        const output = this.core.guarantee(copy, isStrict as boolean);
        lengthManager.fix();
        const errorLog = catcher.getError('check', data); 
        errorLog && onErr && onErr(catcher.getError('check', data));
        clear(this, 'guarantee', data);
        return output;
    }

    /**
     * @param {the mock setting for array length} settings 
     * @param {whether it's in production environment} prod 
     */
    mock(settingsIn = {}, prod: boolean = IPA.isProductionEnv) {
        callers.push(this);
        let settings = settingsIn;
        if (!isPlainObject(settings)) {
            if (!IPA.isProductionEnv) throw new Error('mocking setting  a plain object');
            settings = {};
        }
        lengthManager.digest(settings);
        const output = this.core.mock(prod);
        clear();
        return output;
    }

    onError(f: IPAErrorSubscriber) {
        this.errorHandler = f;
        return this;
    }
}

Reflect.ownKeys(IPA).forEach((key: string) => {
    if (['name', 'length', 'prototype'].indexOf(key) !== -1 && isFunction(IPA[key])) {
        IPA[key].name = key;
        IPA[key].toString = () => `IPA static method: ${key}`;
    }
});

export default IPA;
