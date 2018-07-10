import { IPACore, IPAStrategy } from './interface';

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

function ShallReset(target: any, name: string, descriptor: PropertyDescriptor): void {
    descriptor.value();
    privateCache.reset();
    publicCache.reset();
    catcher.clear();
}

export default class IPA extends IPALike {
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

    public static asClass = asClass;
    public static assemble = assemble;
    public static Dict = Dict;
    public static Each = Each;
    public static From = From;
    public static Integer = Integer;
    public static or = or;
    public static Range = Range;

    public core: IPACore = null;
    public strategy: IPAStrategy = IPAStrategy.Shortest;

    constructor(template: any) {
        super();
        this.core = compile(template);
    }

    @ShallReset
    check(data) {
        return this.core.check(data) && checkLength();
    }

    /**
     * @param {the inputting data to be guaranteed} data
     * @param {whether to make a deep copy first} isCopy
     * @param {whether to use the strict mode} strict
     */
    @ShallReset
    guarantee(data, isCopy = true, strict = false) {
        const copy = isCopy ? cloneDeep(data) : data;
        const output = this.core.guarantee(copy, strict);
        fixArray(this.strategy);
        return output;
    }

    /**
     * @param {the mock setting for array length} settings 
     * @param {whether it's in production environment} prod 
     */
    @ShallReset
    mock(settingsIn = {}, prod = IPA.isProductionEnv) {
        let settings = settingsIn;
        if (!isPlainObject(settings)) {
            if (!IPA.isProductionEnv) throw new Error('mocking setting should be a plain object');
            settings = {};
        }
        privateCache.digest(settings);
        return this.core.mock(prod);
    }
}
