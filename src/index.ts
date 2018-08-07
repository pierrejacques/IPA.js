import { IPACore, IPAStrategy, IPACompileFunction, IPAErrorSubscriber, IPAGuaranteeOptions } from './interface';

import { cloneDeep, isPlainObject } from 'lodash';
import callers from './lib/callers';
import catcher from './lib/catcher';
import cache from './lib/cache';
import { and } from './lib/logics';
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

export default class IPA extends IPALike {
    private static errorHandler: IPAErrorSubscriber = null;
    public static isProductionEnv: boolean = false;
    private static instances: Map<any, IPA> = new Map();

    public static inject = (name: any, template: any): void => {
        if (IPA.instances.has(name) && !IPA.isProductionEnv) {
            throw new Error('in inject: reassign to global IPA instance is not arrowed');
        }
        IPA.instances.set(name, new IPA(template));
    };
    public static getInstance = (name: any): IPALike => {
        let i = null;
        return new IPAProxy(() => {
            if (i) return i;
            i = IPA.instances.get(name);
            if (i === undefined) throw new Error('in getInstance: IPA instance called before injected');
            return i;
        });
    };
    public static compile: IPACompileFunction = compile;
    public static install = (v: Function): void => {
        v.prototype.$ipa = IPA.getInstance;
        v.prototype.$brew = compile;
    };
    
    public static onError = (f: IPAErrorSubscriber) => {
        IPA.errorHandler = f;
        return IPA;
    };

    private static $emit = (instance?: IPA, method?: string, input?: any) => {
        let errorLog = catcher.getError(method, input);
        errorLog && instance.errorHandler && instance.errorHandler(errorLog);
        errorLog = catcher.getError(method, input);
        errorLog && IPA.errorHandler && IPA.errorHandler(errorLog);
        [lengthManager, cache, catcher].forEach(clearable => clearable.clear());
        callers.pop();
    };

    public static asClass = asClass;
    public static assemble = assemble;
    public static Dict = Dict;
    public static Each = Each;
    public static From = From;
    public static Integer = Integer;
    public static or = or;
    public static Range = Range;
    public static recurse = recurse;

    private errorHandler: IPAErrorSubscriber = null;
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
        IPA.$emit(this, 'check', data);
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
        IPA.$emit(this, 'guarantee', data);
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
        IPA.$emit();
        return output;
    }

    onError(f: IPAErrorSubscriber) {
        this.errorHandler = f;
        return this;
    }
}
