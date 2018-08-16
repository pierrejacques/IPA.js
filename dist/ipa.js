(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.IPA = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    var IPAStrategy;
    (function (IPAStrategy) {
        IPAStrategy["Shortest"] = "shortest";
        IPAStrategy["Longest"] = "longest";
        IPAStrategy["Most"] = "most";
        IPAStrategy["Average"] = "average";
        IPAStrategy["Least"] = "least";
    })(IPAStrategy || (IPAStrategy = {}));

    var cloneDeep = require('lodash/cloneDeep');
    var isEqual = require('lodash/isEqual');
    // tools
    var getTag = function (v) { return Reflect.toString.call(v); };
    var getType = function (v) { return typeof v; };
    var Judger = function (type, tag) { return function (v) {
        var t = getType(v);
        return t === type || tag && t !== null && t === 'object' && getTag(v) === tag;
    }; };
    var dict = 'ad,aliqua,amet,anim,aute,cillum,commodo,culpa,do,dolor,duis,elit,enim,esse,est,et,ex,fugiat,id,in,ipsum,irure,labore,lorem,magna,minim,mollit,nisi,non,nulla,officia,pariatur,quis,sint,sit,sunt,tempor,ut,velit,veniam'
        .split(',');
    // is
    var isArray = Array.isArray;
    var isInteger = Number.isSafeInteger;
    var isBoolean = Judger('boolean', '[object Boolean]');
    var isPlainObject = function (v) { return getTag(v) === '[object Object]'; };
    var isNumber = Judger('number', '[object Number]');
    var isString = Judger('string', '[object String]');
    var isFunction = function (v) { return getType(v) === 'function'; };
    // random
    var random = function (lower, upper, floating) {
        if (floating === void 0) { floating = false; }
        return floating ?
            Math.random() * (upper - lower) + lower : Math.floor(Math.random() * (upper - lower + 1)) + lower;
    };
    // loop
    var loop = function (arr, cb) {
        for (var i = 0, n = arr.length; i < n; i++) {
            cb(arr[i], i);
        }
    };
    var times = function (n, iteratee) {
        var arr = Array(n).fill(null);
        loop(arr, function (_, i) {
            arr[i] = iteratee(i);
        });
        return arr;
    };
    // transfer
    var toNumber = function (v) {
        var w = Number(v);
        if (!isFinite(w)) {
            var sign = w > 0 ? 1 : -1;
            w = sign * Number.MAX_SAFE_INTEGER;
        }
        return w || 0;
    };
    var toString = function (v) { return v === null || v === undefined ? '' : String(v); };
    var toInteger = function (v) { return Math.round(toNumber(v)); };
    var toArray = function (v) {
        var e_1, _a;
        if (isArray(v))
            return v;
        if (isPlainObject(v))
            return Object.values(v);
        if (v === null || v === undefined || !v[Symbol.iterator])
            return [];
        var result = [];
        try {
            for (var v_1 = __values(v), v_1_1 = v_1.next(); !v_1_1.done; v_1_1 = v_1.next()) {
                var i = v_1_1.value;
                result.push(i);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (v_1_1 && !v_1_1.done && (_a = v_1.return)) _a.call(v_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    var randStr = function () { return dict[random(0, dict.length - 1)]; };
    // logics
    var and = function () {
        var bools = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            bools[_i] = arguments[_i];
        }
        var flag = true;
        loop(bools, function (item) {
            if (!item)
                flag = false;
        });
        return flag;
    };
    var every = function (arr, handler) {
        var flag = true;
        loop(arr, function (item, i) {
            if (!handler(item, i))
                flag = false;
        });
        return flag;
    };

    var callers = [];
    var callers$1 = {
        get root() {
            return callers[0];
        },
        get current() {
            return callers[callers.length - 1];
        },
        push: function (caller) {
            callers.push(caller);
        },
        pop: function () {
            callers.pop();
        },
    };

    var STACK_CHUNK_SIZE = 10;
    var exceptions = {};
    var stack = [];
    var isFree = false;
    var pointer = 0;
    function match(key, deepKey) {
        var result = key.indexOf(deepKey);
        var len = deepKey.length;
        return key === deepKey || (result === 0 &&
            /[.\[]/.test(key[len]));
    }
    var IPAError = /** @class */ (function () {
        function IPAError(method, exceptions, input) {
            this.method = method;
            this.exceptions = exceptions;
            this.input = input;
        }
        IPAError.prototype.has = function (deepKey) {
            return Object.keys(this.exceptions).some(function (key) { return match(key, "input" + deepKey); });
        };
        IPAError.prototype.stopPropagation = function () {
            catcher.clear();
        };
        return IPAError;
    }());
    var catcher = {
        clear: function () {
            if (callers$1.root === callers$1.current) {
                exceptions = {};
                stack = [];
                pointer = -1;
            }
        },
        pop: function () {
            pointer--;
        },
        push: function (key) {
            pointer++;
            if (stack.length <= pointer) {
                for (var i = 0; i < STACK_CHUNK_SIZE; i++) {
                    stack.push(null);
                }
            }
            stack[pointer] = typeof key === 'string' ? "." + key : "[" + key + "]";
        },
        catch: function (msg, result) {
            if (result === void 0) { result = false; }
            if (!result) {
                this.log(this.currentKey, "should be " + msg);
            }
            return result;
        },
        wrap: function (key, getResult) {
            this.push(key);
            var result = getResult();
            this.pop();
            return result;
        },
        log: function (suffix, msg) {
            if (isFree)
                return;
            var key = "input" + suffix;
            if (exceptions[key]) {
                exceptions[key] += " && " + msg;
            }
            else {
                exceptions[key] = msg;
            }
        },
        free: function (callback) {
            isFree = true;
            var result = callback();
            isFree = false;
            return result;
        },
        getError: function (method, input) {
            if (callers$1.root !== callers$1.current)
                return null;
            return Object.keys(exceptions).length ? new IPAError(method, exceptions, input) : null;
        },
        get currentKey() {
            if (pointer < 0)
                return '';
            return stack.slice(0, pointer + 1).join('');
        },
    };

    var runtimeCacheMap = new Map();
    var cache = {
        get cache() {
            var caller = callers$1.current;
            if (!runtimeCacheMap.has(caller)) {
                runtimeCacheMap.set(caller, new Map());
            }
            return runtimeCacheMap.get(caller);
        },
        has: function (key) {
            return this.cache.has(key);
        },
        delete: function (key) {
            return this.cache.delete(key);
        },
        clear: function () {
            return runtimeCacheMap.delete(callers$1.current);
        },
        set: function (key, value) {
            return this.cache.set(key, value);
        },
        get: function (key) {
            return this.cache.get(key);
        },
    };

    var lengthManagerSymbol = Symbol('lengthManagerScope');
    var recurserSymbol = Symbol('recurseScope');

    var strategies = {
        most: function (val) {
            var freqs = {};
            var maxFreq = 0;
            var maxLen = null;
            loop(val, function (item) {
                var length = item.target.length;
                if (freqs[length] === undefined) {
                    freqs[length] = 0;
                }
                var freq = ++freqs[length];
                if (freq > maxFreq) {
                    maxFreq = freq;
                    maxLen = length;
                }
            });
            return maxLen;
        },
        shortest: function (val) {
            var min = Infinity;
            loop(val, function (item) {
                var l = item.target.length;
                if (l < min)
                    min = l;
            });
            return min;
        },
        longest: function (val) {
            var max = -Infinity;
            loop(val, function (item) {
                var l = item.target.length;
                if (l > max)
                    max = l;
            });
            return max;
        },
        average: function (val) {
            var s = 0;
            loop(val, function (item) {
                s += item.target.length;
            });
            return Math.ceil(s / val.length);
        },
    };
    var staticRules = [{
            match: /^(==)?(\d{1,})$/,
            check: function (arr, len) { return arr.length === len; },
            target: function (len) { return len; },
            generate: function (len) { return len; },
            msg: 'equal to',
        }, {
            match: /^>(\d{1,})$/,
            check: function (arr, len) { return arr.length > len; },
            target: function (len) { return len + 1; },
            generate: function (len) { return random(len + 1, len + 6); },
            msg: 'strictly longer than',
        }, {
            match: /^>=(\d{1,})$/,
            check: function (arr, len) { return arr.length >= len; },
            target: function (len) { return len; },
            generate: function (len) { return random(len, len + 5); },
            msg: 'longer than',
        }, {
            match: /^<(\d{1,})$/,
            check: function (arr, len) { return arr.length < len; },
            target: function (len) { return len - 1; },
            generate: function (len) { return random(0, len - 1); },
            msg: 'strictly shorter than'
        }, {
            match: /^<=(\d{1,})$/,
            check: function (arr, len) { return arr.length <= len; },
            target: function (len) { return len; },
            generate: function (len) { return random(0, len); },
            msg: 'shorter than',
        }];
    var lengthManager = {
        get scope() {
            if (!cache.has(lengthManagerSymbol)) {
                cache.set(lengthManagerSymbol, new Map());
            }
            return cache.get(lengthManagerSymbol);
        },
        push: function (name, item) {
            if (!isArray(this.scope.get(name))) {
                this.scope.set(name, []);
            }
            this.scope.get(name).push(item);
        },
        digest: function (settings) {
            var _this = this;
            loop(Object.keys(settings), function (key) {
                _this.scope.set(key, settings[key]);
            });
        },
        check: function () {
            var e_1, _a, e_2, _b;
            var result = true;
            try {
                for (var _c = __values(this.scope), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                    var _loop_1 = function (match, check, msg) {
                        if (match.test(key)) {
                            var len_1 = extract(match, key);
                            loop(value, function (item) {
                                if (item.method === 'check' && !check(item, len_1)) {
                                    catcher.log(item.key, "length should be " + msg + " " + len_1);
                                    result = false;
                                }
                            });
                        }
                    };
                    try {
                        for (var staticRules_1 = __values(staticRules), staticRules_1_1 = staticRules_1.next(); !staticRules_1_1.done; staticRules_1_1 = staticRules_1.next()) {
                            var _f = staticRules_1_1.value, match = _f.match, check = _f.check, msg = _f.msg;
                            _loop_1(match, check, msg);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (staticRules_1_1 && !staticRules_1_1.done && (_b = staticRules_1.return)) _b.call(staticRules_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    var allEqual = true;
                    var l = value[0].length;
                    for (var i = 1; i < value.length; i++) {
                        if (value[i].length !== l) {
                            allEqual = false;
                            break;
                        }
                    }
                    if (!allEqual) {
                        result = false;
                        loop(value, function (item) {
                            catcher.log(item.key, 'length unmatched');
                        });
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        },
        fix: function () {
            var e_3, _a, e_4, _b;
            var strategy = strategies[callers$1.current.strategy] || strategies.shortest;
            try {
                for (var _c = __values(this.scope), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                    var _loop_2 = function (match, target, check) {
                        if (match.test(key)) {
                            var l_1 = extract(match, key);
                            fix(value.filter(function (i) { return i.method === 'fix' && !check(i.target, l_1); }), target(l_1));
                            return { value: void 0 };
                        }
                    };
                    try {
                        for (var staticRules_2 = __values(staticRules), staticRules_2_1 = staticRules_2.next(); !staticRules_2_1.done; staticRules_2_1 = staticRules_2.next()) {
                            var _f = staticRules_2_1.value, match = _f.match, target = _f.target, check = _f.check;
                            var state_1 = _loop_2(match, target, check);
                            if (typeof state_1 === "object")
                                return state_1.value;
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (staticRules_2_1 && !staticRules_2_1.done && (_b = staticRules_2.return)) _b.call(staticRules_2);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    fix(value, strategy(value));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
        },
        generate: function (key, isProd) {
            var e_5, _a;
            try {
                for (var staticRules_3 = __values(staticRules), staticRules_3_1 = staticRules_3.next(); !staticRules_3_1.done; staticRules_3_1 = staticRules_3.next()) {
                    var _b = staticRules_3_1.value, match = _b.match, target = _b.target, generate = _b.generate;
                    if (match.test(key)) {
                        var l = extract(match, key);
                        return isProd ? target(l) : generate(l);
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (staticRules_3_1 && !staticRules_3_1.done && (_a = staticRules_3.return)) _a.call(staticRules_3);
                }
                finally { if (e_5) throw e_5.error; }
            }
            if (!isNumber(this.scope.get(key)))
                this.scope.set(key, isProd ? 0 : random(0, 10));
            return this.scope.get(key);
        }
    };
    function fix(toBeFixed, len) {
        loop(toBeFixed, function (item) {
            var arr = item.target, mocker = item.mocker;
            if (arr.length === len)
                return;
            if (!item.isFree) {
                catcher.log(item.key, 'length unmatch');
            }
            catcher.free(function () {
                if (arr.length > len) {
                    arr.splice(len);
                }
                else {
                    arr.push.apply(arr, __spread(times(len - arr.length, mocker)));
                }
            });
        });
    }
    function extract(regExp, string) {
        var matched = regExp.exec(string);
        return matched && parseInt(matched[matched.length - 1], 10);
    }

    var IPALike = /** @class */ (function () {
        function IPALike() {
        }
        IPALike.prototype.check = function (data) { return true; };
        IPALike.prototype.guarantee = function (data, options, onError) { };
        IPALike.prototype.mock = function (config, isProdEnv) { };
        return IPALike;
    }());
    var IPAProxy = /** @class */ (function (_super) {
        __extends(IPAProxy, _super);
        function IPAProxy(getInstance) {
            var _this = _super.call(this) || this;
            _this.getInstance = getInstance;
            return _this;
        }
        Object.defineProperty(IPAProxy.prototype, "core", {
            get: function () {
                return this.getInstance().core;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IPAProxy.prototype, "strategy", {
            get: function () {
                return this.getInstance().strategy;
            },
            set: function (v) {
                this.getInstance().strategy = v;
            },
            enumerable: true,
            configurable: true
        });
        IPAProxy.prototype.check = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var _a;
            return (_a = this.getInstance()).check.apply(_a, __spread(params));
        };
        IPAProxy.prototype.guarantee = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var _a;
            return (_a = this.getInstance()).guarantee.apply(_a, __spread(params));
        };
        IPAProxy.prototype.mock = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var _a;
            return (_a = this.getInstance()).mock.apply(_a, __spread(params));
        };
        return IPAProxy;
    }(IPALike));

    var bypasser = {
        check: function () { return true; },
        guarantee: function (v) { return v; },
        mock: function () { return undefined; },
    };

    var Strat = function (ck, cvt, dft, mk, describe) { return function (_a) {
        var catcher = _a.catcher;
        return ({
            check: function (v) { return catcher.catch(describe, ck(v)); },
            guarantee: function (v, strict) {
                return this.check(v) ? v : strict ? dft : cvt(v);
            },
            mock: function (prod) { return prod ? dft : mk(); },
        });
    }; };
    var functionCompilerMap = new Map()
        .set(String, Strat(isString, toString, '', randStr, 'a string'))
        .set(Number, Strat(isNumber, function (v) { return +v || 0; }, 0, function () { return random(0, 100); }, 'a number'))
        .set(Boolean, Strat(isBoolean, function (v) { return !!v; }, false, function () { return !random(0, 1); }, 'a boolean'))
        .set(Array, Strat(isArray, toArray, [], function () { return []; }, 'an array'))
        .set(Object, Strat(isPlainObject, function () { return ({}); }, {}, function () { return ({}); }, 'a plain object'))
        .set(Function, Strat(isFunction, function () { return function () { }; }, function () { }, function () { return function () { }; }, 'a function'));
    var funcComp = {
        condition: isFunction,
        execute: function (template) {
            if (functionCompilerMap.has(template))
                return functionCompilerMap.get(template);
            return function (cp) { return Object.assign({}, bypasser, template(cp)); };
        },
    };

    var ipaInstanceCompiler = {
        condition: function (template) {
            return Boolean(template && (template instanceof IPALike));
        },
        execute: function (template) {
            return function () { return template.core; };
        },
    };

    var arrayCompiler = {
        condition: function (template) {
            return isArray(template);
        },
        execute: function (template) {
            var l = template[1];
            if (l !== undefined && !isNumber(l) && !isString(l)) {
                throw new Error('compile failed: the 2nd parameter for array can only be String or Number');
            }
            l = l && l.toString();
            return function (_a) {
                var compile = _a.compile, catcher = _a.catcher;
                var compiled = compile(template[0]);
                return {
                    check: function (val) {
                        if (!isArray(val)) {
                            return catcher.catch('array');
                        }
                        if (l !== undefined) {
                            lengthManager.push(l, {
                                length: val.length,
                                key: catcher.currentKey,
                                method: 'check',
                            });
                        }
                        var result = true;
                        // result = every(val, (item) => typeof item !== 'number'); // 9.5ms
                        // result = every(val, (item) => compiled.check(item)); // TODO: 1230ms
                        result = every(val, function (item, index) { return catcher.wrap(index, function () { return compiled.check(item); }); }); // TODO: 1690ms
                        return result;
                    },
                    guarantee: function (valIn, strict) {
                        var val = valIn;
                        var isFree = false;
                        if (!catcher.catch('an array', isArray(valIn))) {
                            val = [];
                            isFree = true;
                        }
                        else {
                            loop(val, function (item, i) {
                                val[i] = catcher.wrap(i, function () { return compiled.guarantee(item, strict); });
                            });
                        }
                        if (l !== undefined) {
                            lengthManager.push(l, {
                                target: val,
                                key: catcher.currentKey,
                                isFree: isFree,
                                mocker: function () { return compiled.guarantee.call(compiled, undefined, strict); },
                                method: 'fix',
                            });
                        }
                        return val;
                    },
                    mock: function (prod) {
                        return times(lengthManager.generate(l, prod), function () { return compiled.mock.call(compiled, prod); });
                    },
                };
            };
        },
    };

    var booleanCompiler = {
        condition: isBoolean,
        execute: function (template) {
            return function (_a) {
                var catcher = _a.catcher;
                return ({
                    check: function (v) { return catcher.catch('boolean', isBoolean(v)); },
                    guarantee: function (v) {
                        return this.check(v) ? v : template;
                    },
                    mock: function (prod) { return prod ? template : !random(0, 1); },
                });
            };
        },
    };

    var nullCompiler = {
        condition: function (t) { return t === null; },
        execute: function () {
            return function (_a) {
                var catcher = _a.catcher;
                return ({
                    check: function (v) { return catcher.catch('defined', v !== undefined); },
                    guarantee: function (v) {
                        return this.check(v) ? v : null;
                    },
                    mock: function () { return null; },
                });
            };
        },
    };

    var numberCompiler = {
        condition: isNumber,
        execute: function (template) {
            return function (_a) {
                var catcher = _a.catcher;
                return ({
                    check: function (v) { return catcher.catch('a number', isNumber(v)); },
                    guarantee: function (v) {
                        return this.check(v) ? v : template;
                    },
                    mock: function (prod) { return prod ? template : random(0, 100); },
                });
            };
        },
    };

    var objectCompiler = {
        condition: function (template) {
            return isPlainObject(template) && !(template instanceof IPALike);
        },
        execute: function (template) {
            return function (_a) {
                var compile = _a.compile, catcher = _a.catcher;
                var compiled = {};
                var notRequiredExp = /^(.{1,})\?$/;
                var stillRequiredExp = /^.{0,}\\\?$/;
                var isAbsent = function (v) { return v === undefined || v === null; };
                loop(Object.entries(template), function (_a) {
                    var _b = __read(_a, 2), key = _b[0], value = _b[1];
                    var rule = compile(value);
                    if (!isString(key) || !notRequiredExp.test(key)) {
                        compiled[key] = rule;
                        return;
                    }
                    if (stillRequiredExp.test(key)) {
                        compiled[key.slice(0, -2) + '?'] = rule;
                        return;
                    }
                    compiled[notRequiredExp.exec(key)[1]] = {
                        check: function (v) { return isAbsent(v) || rule.check.call(rule, v); },
                        guarantee: function (v, s) { return isAbsent(v) ? v : rule.guarantee.call(rule, v, s); },
                        mock: rule.mock.bind(rule),
                    };
                });
                return {
                    check: function (val) {
                        return catcher.catch('a plain object', isPlainObject(val)) &&
                            every(Object.keys(compiled), function (key) { return catcher.wrap(key, function () { return compiled[key].check(val[key]); }); });
                    },
                    guarantee: function (valIn, strict) {
                        var val = valIn;
                        var process = function () {
                            loop(Object.keys(compiled), function (key) {
                                var absent = !val.hasOwnProperty(key);
                                var result = catcher.wrap(key, function () { return compiled[key].guarantee(val[key], strict); });
                                if (absent && result === undefined)
                                    return;
                                val[key] = result;
                            });
                        };
                        if (!catcher.catch('a plain object', isPlainObject(valIn))) {
                            val = {};
                            catcher.free(process);
                        }
                        else {
                            process();
                        }
                        return val;
                    },
                    mock: function (prod) {
                        var val = {};
                        loop(Object.keys(compiled), function (key) {
                            val[key] = compiled[key].mock(prod);
                        });
                        return val;
                    },
                };
            };
        },
    };

    var undefinedCompiler = {
        condition: function (t) { return t === undefined; },
        execute: function () { return function () { return bypasser; }; },
    };

    var stringCompiler = {
        condition: isString,
        execute: function (template) { return function (_a) {
            var catcher = _a.catcher, cache = _a.cache;
            var e_1, _b;
            var recurserScope = cache.get(recurserSymbol);
            if (recurserScope) {
                try {
                    for (var recurserScope_1 = __values(recurserScope), recurserScope_1_1 = recurserScope_1.next(); !recurserScope_1_1.done; recurserScope_1_1 = recurserScope_1.next()) {
                        var item = recurserScope_1_1.value;
                        if (item.marker === template) {
                            return item.asset;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (recurserScope_1_1 && !recurserScope_1_1.done && (_b = recurserScope_1.return)) _b.call(recurserScope_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return {
                check: function (v) { return catcher.catch('string', isString(v)); },
                guarantee: function (v) {
                    return this.check(v) ? v : template;
                },
                mock: function (prod) { return prod ? template : randStr(); },
            };
        }; },
    };

    var compilers = [
        funcComp,
        ipaInstanceCompiler,
        arrayCompiler,
        booleanCompiler,
        nullCompiler,
        numberCompiler,
        objectCompiler,
        undefinedCompiler,
        stringCompiler,
    ];
    var context = {
        compile: null,
        cache: cache,
        catcher: catcher,
    };
    var compile = function (template) {
        var compiler = compilers.find(function (item) { return item.condition(template); });
        if (!compiler)
            throw new Error("compile error: failed to recognize pattern " + JSON.stringify(template));
        return compiler.execute(template)(context);
    };
    context.compile = compile;

    var asClass = (function (Klass) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var errorMsg = " instance of " + Klass.name;
        return function (_a) {
            var catcher = _a.catcher;
            return ({
                check: function (v) { return catcher.catch(errorMsg, v instanceof Klass); },
                guarantee: function (v) {
                    return this.check(v) ? v : new (Klass.bind.apply(Klass, __spread([void 0], params)))();
                },
                mock: function () { return new (Klass.bind.apply(Klass, __spread([void 0], params)))(); },
            });
        };
    });

    var Dict = (function (template) { return function (_a) {
        var compile = _a.compile, catcher = _a.catcher;
        var compiled = compile(template);
        return {
            check: function (val) {
                return catcher.catch('a plain object', isPlainObject(val)) &&
                    every(Object.keys(val), function (k) { return catcher.wrap(k, function () { return compiled.check(val[k]); }); });
            },
            guarantee: function (val, strict) {
                if (!catcher.catch('a plain object', isPlainObject(val)))
                    return {};
                var loopee = Object.keys(val);
                loop(loopee, function (key) {
                    val[key] = catcher.wrap(key, function () { return compiled.guarantee(val[key], strict); });
                });
                return val;
            },
            mock: function (prod) {
                var output = {};
                loop(times(prod ? 0 : random(1, 10), randStr), function (key) {
                    output[key] = compiled.mock(prod);
                });
                return output;
            },
        };
    }; });

    var Integer = (function (_a) {
        var catcher = _a.catcher;
        return ({
            check: function (v) { return catcher.catch('an integer', isInteger(v)); },
            guarantee: function (v, strict) {
                return this.check(v) ? v : strict ? 0 : toInteger(v);
            },
            mock: function (prod) { return prod ? 0 : random(0, 100); },
        });
    });

    var or = (function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var n = params.length;
        if (n < 2)
            throw new Error('function "or" requires at least 2 parameter');
        return function (_a) {
            var compile = _a.compile, catcher = _a.catcher;
            var rules = times(n, function (i) {
                return compile(params[i]);
            });
            return {
                check: function (val) { return catcher.catch('matched with one of the rules', catcher.free(function () { return rules.some(function (rule) { return rule.check(val); }); })); },
                guarantee: function (val, strict) {
                    return this.check(val) ? val : catcher.free(function () { return rules[0].guarantee(val, strict); });
                },
                mock: function (prod) {
                    return rules[0].mock(prod);
                },
            };
        };
    });

    var Range = (function (min, max, isFloat) {
        if (isFloat === void 0) { isFloat = false; }
        if (min > max) {
            throw new Error('in function "Range", min(1st param) must be no larger than max(2st param)');
        }
        return function (_a) {
            var compile = _a.compile, catcher = _a.catcher;
            return {
                check: function (val) { return and(catcher.catch('a number', isNumber(val)), catcher.catch("in range [" + min + ", " + max + "]", val >= min && val <= max)); },
                guarantee: function (val, strict) {
                    if (this.check(val))
                        return val;
                    return catcher.free(function () {
                        var v = compile(Number).guarantee(val, strict);
                        if (v < min)
                            return min;
                        if (v > max)
                            return max;
                        return v;
                    });
                },
                mock: function (prod) { return prod ? min : random(min, max, isFloat); },
            };
        };
    });

    var Each = (function (template, strictLength) {
        if (strictLength === void 0) { strictLength = true; }
        var len = template.length;
        return function (_a) {
            var compile = _a.compile, catcher = _a.catcher;
            var compiled = times(len, function (i) {
                return compile(template[i]);
            });
            return {
                check: function (val) { return catcher.catch('an array', isArray(val)) && and(catcher.catch("with length of " + len, !strictLength || val.length === len), every(compiled, function (item, i) { return catcher.wrap(i, function () { return item.check(val[i]); }); })); },
                guarantee: function (valIn, strict) {
                    var val = valIn;
                    var process = function () {
                        loop(template, function (item, i) {
                            val[i] = catcher.wrap(i, function () { return compiled[i].guarantee(val[i], strict); });
                        });
                    };
                    if (!catcher.catch('an array', isArray(valIn))) {
                        val = [];
                        catcher.free(process);
                        return val;
                    }
                    process();
                    if (strictLength && val.length !== len) {
                        val.splice(len);
                        catcher.catch("with length of " + len);
                    }
                    return val;
                },
                mock: function (prod) { return times(len, function (i) { return compiled[i].mock(prod); }); },
            };
        };
    });

    var From = (function () {
        var set = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            set[_i] = arguments[_i];
        }
        var getRandom = function () {
            var v = set[random(0, set.length - 1)];
            return cloneDeep(v);
        };
        var getFirst = function () { return cloneDeep(set[0]); };
        var msg = set.length > 1 ? "from " + set : "" + set[0];
        return function (_a) {
            var catcher = _a.catcher;
            return ({
                check: function (val) { return catcher.catch(msg, set.findIndex(function (item) { return isEqual(item, val); }) !== -1); },
                guarantee: function (val, strict) {
                    return this.check(val) ? val : strict ? set[0] : getRandom();
                },
                mock: function (prod) { return prod ? getFirst() : getRandom(); },
            });
        };
    });

    var assemble = (function (c, g, m) { return function (_a) {
        var compile = _a.compile;
        var cp = compile(c);
        var gp = compile(g);
        var mp = compile(m);
        return {
            check: cp.check.bind(cp),
            guarantee: gp.guarantee.bind(gp),
            mock: mp.mock.bind(mp),
        };
    }; });

    function getDefaultCondition(temp) {
        if (isPlainObject(temp))
            return isPlainObject;
        if (!isArray(temp))
            return function () { return false; };
        var convergeList = [/^0{1,}$/, /^>=0{1,}$/, /^<=?\d{1,}$/]; // 收敛名单
        if (!temp[1] && convergeList.some(function (i) { return i.test(temp[1]); }))
            return isArray;
        return function (v) { return isArray(v) && v.length > 0; };
    }
    var recurse = (function (subTemplate, options) { return function (_a) {
        var compile = _a.compile, cache = _a.cache, catcher = _a.catcher;
        var _b = options || {}, _c = _b.marker, marker = _c === void 0 ? '$$' : _c, _d = _b.border, border = _d === void 0 ? From(null) : _d, _e = _b.condition, condition = _e === void 0 ? getDefaultCondition(subTemplate) : _e;
        var borderCompiled = compile(border);
        var compiled = null;
        var counterKey = Symbol('recurserCounter');
        var asset = {
            check: function (v) {
                return catcher.catch('matched with one of the rules', catcher.free(function () { return borderCompiled.check.call(borderCompiled, v) || compiled.check.call(compiled, v); }));
            },
            guarantee: function (v) {
                var _this = this;
                if (catcher.free(function () { return _this.check(v); }))
                    return v;
                return condition(v) ? compiled.guarantee.call(compiled, v) : borderCompiled.guarantee.call(borderCompiled, v);
            },
            mock: function (prod) {
                if (!cache[counterKey]) {
                    cache[counterKey] = 1;
                }
                var count = cache[counterKey];
                var result = !prod && count < 10 && random(0, count) === 0 ?
                    compiled.mock.call(compiled) : borderCompiled.mock.call(borderCompiled);
                cache[counterKey] += 1;
                return result;
            },
        };
        if (!cache.get(recurserSymbol))
            cache.set(recurserSymbol, []);
        var stack = cache.get(recurserSymbol);
        stack.unshift({ marker: marker, asset: asset });
        compiled = compile(subTemplate);
        stack.shift();
        if (!stack.length)
            cache.delete(recurserSymbol);
        return compiled;
    }; });

    var errorHandler = null;
    var instances = new Map();
    var clear = function (instance, method, input) {
        var errorLog = catcher.getError(method, input);
        errorLog && instance.errorHandler && instance.errorHandler(errorLog);
        errorLog = catcher.getError(method, input);
        errorLog && errorHandler && errorHandler(errorLog);
        cache.clear();
        catcher.clear();
        callers$1.pop();
    };
    var IPA = /** @class */ (function (_super) {
        __extends(IPA, _super);
        function IPA(template) {
            var _this = _super.call(this) || this;
            _this.errorHandler = null;
            _this.core = null;
            _this.strategy = IPAStrategy.Shortest;
            _this.core = compile(template);
            return _this;
        }
        IPA.prototype.check = function (data, onError) {
            callers$1.push(this);
            var output = and(this.core.check(data), lengthManager.check());
            var errorLog = catcher.getError('check', data);
            errorLog && onError && onError(catcher.getError('check', data));
            clear(this, 'check', data);
            return output;
        };
        /**
         * @param {the inputting data to be guaranteed} data
         * @param {guarantee Options} isCopy
         * @param {method level errorHandler} onError
         */
        IPA.prototype.guarantee = function (data, options, onError) {
            var opt, onErr;
            if (isPlainObject(options)) {
                opt = options;
                onErr = onError;
            }
            else {
                onErr = options;
            }
            var _a = Object.assign({
                copy: true,
                strict: false,
            }, opt || {}), isCopy = _a.copy, isStrict = _a.strict;
            callers$1.push(this);
            var copy = isCopy ? cloneDeep(data) : data;
            var output = this.core.guarantee(copy, isStrict);
            lengthManager.fix();
            var errorLog = catcher.getError('check', data);
            errorLog && onErr && onErr(catcher.getError('check', data));
            clear(this, 'guarantee', data);
            return output;
        };
        /**
         * @param {the mock setting for array length} settings
         * @param {whether it's in production environment} prod
         */
        IPA.prototype.mock = function (settingsIn, prod) {
            if (settingsIn === void 0) { settingsIn = {}; }
            if (prod === void 0) { prod = IPA.isProductionEnv; }
            callers$1.push(this);
            var settings = settingsIn;
            if (!isPlainObject(settings)) {
                if (!IPA.isProductionEnv)
                    throw new Error('mocking setting  a plain object');
                settings = {};
            }
            lengthManager.digest(settings);
            var output = this.core.mock(prod);
            clear();
            return output;
        };
        IPA.prototype.onError = function (f) {
            this.errorHandler = f;
            return this;
        };
        IPA.isProductionEnv = false;
        IPA.define = function (name, template) {
            if (instances.has(name))
                return false;
            var instance = new IPA(template);
            instances.set(name, instance);
            return true;
        };
        IPA.Type = function (name) {
            var i = null;
            return new IPAProxy(function () {
                if (i)
                    return i;
                i = instances.get(name);
                return i || new IPA(undefined);
            });
        };
        IPA.compile = compile;
        IPA.cache = cache;
        IPA.cacther = catcher;
        IPA.onError = function (f) {
            errorHandler = f;
            return IPA;
        };
        IPA.asClass = asClass;
        IPA.assemble = assemble;
        IPA.Dict = Dict;
        IPA.Each = Each;
        IPA.From = From;
        IPA.Integer = Integer;
        IPA.or = or;
        IPA.Range = Range;
        IPA.recurse = recurse;
        IPA.toString = function () { return 'IPA runtime type validator'; };
        return IPA;
    }(IPALike));
    Reflect.ownKeys(IPA).forEach(function (key) {
        if (['name', 'length', 'prototype'].indexOf(key) !== -1 && isFunction(IPA[key])) {
            IPA[key].name = key;
            IPA[key].toString = function () { return "IPA static method: " + key; };
        }
    });

    return IPA;

})));
