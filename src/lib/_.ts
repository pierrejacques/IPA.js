export const cloneDeep = require('lodash/cloneDeep');
export const isEqual = require('lodash/isEqual');

// tools

const getTag = (v: any): string => Reflect.toString.call(v);
const getType = (v: any): string => typeof v;
const Judger = (type: string, tag?: string) => (v: any): boolean => {
    const t = getType(v);
    return t === type || tag && t !== null && t === 'object' && getTag(v) === tag;
};

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

export const loop = (n: number, cb: Function) => {
    let i = 0;
    while (i < n) {
        cb(i);
        i++;
    }
};

export const times = (n: number, iteratee: (index?: number) => any): Array<any> => {
    const arr = Array(n).fill(null);
    loop(n, (i) => {
        arr[i] = iteratee(i);
    });
    return arr;
};

export const max = (arr: Array<number>): number => {
    let v = -Infinity;
    loop(arr.length, (i) => {
        const a = arr[i];
        if (a > v) v = a;
    });
    return v;
};

export const min = (arr: Array<number>): number => {
    let v = Infinity;
    loop(arr.length, (i) => {
        const a = arr[i];
        if (a < v) v = a;
    });
    return v;
};

export const mean = (arr: Array<number>): number => {
    let s = 0;
    loop(arr.length, (i) => {
        s += arr[i];
    });
    return s / arr.length;
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
