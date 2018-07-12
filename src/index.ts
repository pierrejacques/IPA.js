import { IPACore, IPAStrategy, IPAErrorLog } from './interface';

import IPALike from './lib/ipa-like';
import { cloneDeep, isPlainObject } from 'lodash';
import { privateCache, publicCache } from './lib/cache';
import catcher from './lib/catcher';

import fixArray from './lib/fixArray';
import checkLength from './lib/checkLength';
import createProxy from './lib/createProxy';
import compile from './compile/index';
import {
    asClass,
    assemble,
    Dict,
    Each,
    From,
    Integer,
    or,
    Range,
} from './public/index';
import and from './lib/and';

export default class IPA extends IPALike {
    private static errorHandler = null;
    public static isProductionEnv = false;
    public static instances = new Map();

    public static inject = (name: any, template: any): void => {
        if (IPA.instances.has(name) && !IPA.isProductionEnv) {
            throw new Error('in inject: reassign to global IPA instance is not arrowed');
        }
        IPA.instances.set(name, new IPA(template));
    };
    public static getInstance = (name: any): IPALike => {
        let i = null;
        return createProxy(() => {
            if (i) return i;
            i = IPA.instances.get(name);
            if (i === undefined) throw new Error('in getInstance: IPA instance called before injected');
            return i;
        });
    };
    public static $compile = compile;
    public static install = (v: Function): void => {
        v.prototype.$ipa = IPA.getInstance;
        v.prototype.$brew = IPA.$compile;
    };
    
    public static onError = (f: Function) => {
        IPA.errorHandler = f;
    };

    private static log = (instance?: IPA, method?: string, input?: any) => {
        privateCache.reset();
        publicCache.reset();
        if (instance && catcher.hasLog) {
            const log: IPAErrorLog = {
                method,
                input,
                exceptions: catcher.logMap,
            };
            instance.errorHandler && instance.errorHandler(log);
            IPA.errorHandler && IPA.errorHandler(log);
        }
        catcher.clear();
    };

    public static asClass = asClass;
    public static assemble = assemble;
    public static Dict = Dict;
    public static Each = Each;
    public static From = From;
    public static Integer = Integer;
    public static or = or;
    public static Range = Range;

    private errorHandler = null;
    public core: IPACore = null;
    public strategy: IPAStrategy = IPAStrategy.Shortest;

    constructor(template: any) {
        super();
        this.core = compile(template);
    }

    check(data) {
        const output = and(this.core.check(data), checkLength())
        IPA.log(this, 'check', data);
        return output;
    }

    /**
     * @param {the inputting data to be guaranteed} data
     * @param {whether to make a deep copy first} isCopy
     * @param {whether to use the strict mode} strict
     */
    guarantee(data, isCopy = true, strict = false) {
        const copy = isCopy ? cloneDeep(data) : data;
        const output = this.core.guarantee(copy, strict);
        fixArray(this.strategy);
        IPA.log(this, 'guarantee', data);
        return output;
    }

    /**
     * @param {the mock setting for array length} settings 
     * @param {whether it's in production environment} prod 
     */
    mock(settingsIn = {}, prod = IPA.isProductionEnv) {
        let settings = settingsIn;
        if (!isPlainObject(settings)) {
            if (!IPA.isProductionEnv) throw new Error('mocking setting  a plain object');
            settings = {};
        }
        privateCache.digest(settings);
        const output = this.core.mock(prod);
        IPA.log();
        return output;
    }

    onError(f: Function) {
        this.errorHandler = f;
    }
}
