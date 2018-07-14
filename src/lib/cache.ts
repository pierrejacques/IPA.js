import callers from './callers';
import { IPALike } from './peer-classes';
import { IPACache } from '../interface';

const runtimeCacheMap: Map<IPALike, Map<any, any>> = new Map();

const cache: IPACache  = {
    get cache() {
        const caller = callers.current;
        if (!runtimeCacheMap.has(caller)) {
            runtimeCacheMap.set(caller, new Map());
        }
        return runtimeCacheMap.get(caller);
    },

    has(key: any) {
        return this.cache.has(key);
    },

    delete(key: any) {
        return this.cache.delete(key);
    },

    clear() {
        return runtimeCacheMap.delete(callers.current);
    },

    set(key: any, value: any) {
        return this.cache.set(key, value);
    },
    
    get(key: any) {
        return this.cache.get(key);
    },
};

export default cache;
