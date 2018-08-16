export const cloneDeep = require('lodash/cloneDeep');
export const isEqual = require('lodash/isEqual');

// tools

const getTag = (v: any): string => Reflect.toString.call(v);
const getType = (v: any): string => typeof v;
const Judger = (type: string, tag?: string) => (v: any): boolean => {
    const t = getType(v);
    return t === type || tag && t !== null && t === 'object' && getTag(v) === tag;
};
const dict: Array<string> = 'ad,aliqua,amet,anim,aute,cillum,commodo,culpa,do,dolor,duis,elit,enim,esse,est,et,ex,fugiat,id,in,ipsum,irure,labore,lorem,magna,minim,mollit,nisi,non,nulla,officia,pariatur,quis,sint,sit,sunt,tempor,ut,velit,veniam'
    .split(',');

// is

export const isArray = Array.isArray;
export const isInteger = Number.isSafeInteger;

export const isBoolean = Judger('boolean', '[object Boolean]');
export const isPlainObject = (v: any) => getTag(v) === '[object Object]';
export const isNumber = Judger('number', '[object Number]');
export const isString = Judger('string', '[object String]');
export const isFunction = (v: any) => getType(v) === 'function';

// random

export const random = (lower: number, upper: number, floating: boolean = false): number => {
    return floating ? 
        Math.random() * (upper - lower) + lower : Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

// loop

export const loop = (arr: Array<any>, cb: Function) => {
    for (let i = 0, n = arr.length; i < n; i++) {
        cb(arr[i], i);
    }
};

export const times = (n: number, iteratee: (index?: number) => any): Array<any> => {
    const arr = Array(n).fill(null);
    loop(arr, (_, i) => {
        arr[i] = iteratee(i);
    });
    return arr;
};

// transfer

export const toNumber = v => {
    let w = Number(v);
    if (!isFinite(w)) {
        const sign = w > 0 ? 1 : -1;
        w = sign * Number.MAX_SAFE_INTEGER;
    }
    return w || 0;
}
export const toString = v => v === null || v === undefined ? '' : String(v);
export const toInteger = v => Math.round(toNumber(v));
export const toArray = v => {
    if (isArray(v)) return v;
    if (isPlainObject(v)) return Object.values(v);
    if (v === null || v === undefined || !v[Symbol.iterator]) return [];
    const result = [];
    for (let i of v) {
        result.push(i);
    }
    return result;
};
export const randStr = () => dict[random(0, dict.length - 1)];

// logics
export const and = (...bools: Array<boolean>): boolean => {
    let flag = true;
    loop(bools, (item) => {
        if (!item) flag = false;
    });
    return flag;
};

export const every = (arr: Array<any>, handler: (item: any, index: number) => boolean ): boolean => {
    let flag = true;
    loop(arr, (item, i) => {
        if (!handler(item, i)) flag = false;
    });
    return flag;
}
