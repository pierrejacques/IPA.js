(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash')) :
    typeof define === 'function' && define.amd ? define(['lodash'], factory) :
    (global.IPA = factory(null));
}(this, (function (lodash) { 'use strict';

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

    var IPAStrategy;
    (function (IPAStrategy) {
        IPAStrategy["Shortest"] = "shortest";
        IPAStrategy["Longest"] = "longest";
        IPAStrategy["Most"] = "most";
        IPAStrategy["Average"] = "average";
        IPAStrategy["Least"] = "least";
    })(IPAStrategy || (IPAStrategy = {}));

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

    var exceptions = {};
    var stack = [];
    var isFree = false;
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
            }
        },
        pop: function () {
            stack.pop();
        },
        push: function (key) {
            var keyStr = typeof key === 'string' ? "." + key : "[" + key + "]";
            stack.push(keyStr);
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
            return stack.join('');
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

    // full checked AND logic
    var and = function () {
        var bools = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            bools[_i] = arguments[_i];
        }
        return bools.every(function (i) { return i; });
    };
    // full checked every method
    var every = function (arr, handler) {
        return arr.map(handler).every(function (v) { return v; });
    };

    var lengthCacheMap = new Map();
    var strategies = {
        most: function (val) {
            var lengths = val.map(function (item) { return item.target.length; });
            var freqs = new Map();
            lengths.forEach(function (length) {
                if (freqs.get(length) === undefined) {
                    freqs.set(length, 0);
                }
                freqs.set(length, freqs.get(length) + 1);
            });
            var maxFreq = null;
            freqs.forEach(function (len, freq) {
                if (!maxFreq || freq > maxFreq.freq) {
                    maxFreq = { len: len, freq: freq };
                }
            });
            return maxFreq.len;
        },
        shortest: function (val) {
            return Math.min.apply(Math, val.map(function (item) { return item.target.length; }));
        },
        longest: function (val) {
            return Math.max.apply(Math, val.map(function (item) { return item.target.length; }));
        },
        average: function (val) {
            var average = lodash.mean(val.map(function (item) { return item.target.length; }));
            return Math.ceil(average);
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
            generate: function (len) { return lodash.random(len + 1, len + 6); },
            msg: 'strictly longer than',
        }, {
            match: /^>=(\d{1,})$/,
            check: function (arr, len) { return arr.length >= len; },
            target: function (len) { return len; },
            generate: function (len) { return lodash.random(len, len + 5); },
            msg: 'longer than',
        }, {
            match: /^<(\d{1,})$/,
            check: function (arr, len) { return arr.length < len; },
            target: function (len) { return len - 1; },
            generate: function (len) { return lodash.random(0, len - 1); },
            msg: 'strictly shorter than'
        }, {
            match: /^<=(\d{1,})$/,
            check: function (arr, len) { return arr.length <= len; },
            target: function (len) { return len; },
            generate: function (len) { return lodash.random(0, len); },
            msg: 'shorter than',
        }];
    var lengthManager = {
        get cache() {
            var caller = callers$1.current;
            if (!lengthCacheMap.has(caller)) {
                lengthCacheMap.set(caller, new Map());
            }
            return lengthCacheMap.get(caller);
        },
        push: function (name, item) {
            if (!lodash.isArray(this.cache.get(name))) {
                this.cache.set(name, []);
            }
            this.cache.get(name).push(item);
        },
        set: function (name, value) {
            this.cache.set(name, value);
        },
        get: function (name) {
            return this.cache.get(name);
        },
        forEach: function (cb) {
            this.cache.forEach(cb);
        },
        clear: function () {
            lengthCacheMap.delete(callers$1.current);
        },
        digest: function (settings) {
            var _this = this;
            Object.keys(settings).forEach(function (key) {
                _this.set(key, settings[key]);
            });
        },
        check: function () {
            var result = true;
            this.cache.forEach(function (value, key) {
                var _loop_1 = function (match, check, msg) {
                    if (match.test(key)) {
                        var len_1 = extract(match, key);
                        value
                            .filter(function (i) { return i.method === 'check'; })
                            .forEach(function (item) {
                            if (!check(item, len_1)) {
                                catcher.log(item.key, "length should be " + msg + " " + len_1);
                                result = false;
                            }
                        });
                        return { value: void 0 };
                    }
                };
                for (var _i = 0, staticRules_1 = staticRules; _i < staticRules_1.length; _i++) {
                    var _a = staticRules_1[_i], match = _a.match, check = _a.check, msg = _a.msg;
                    var state_1 = _loop_1(match, check, msg);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
                var lengths = value.map(function (item) { return item.length; });
                if (lodash.min(lengths) !== lodash.max(lengths)) {
                    result = false;
                    value.forEach(function (item) { return catcher.log(item.key, 'length unmatched'); });
                }
            });
            return result;
        },
        fix: function () {
            var strategy = strategies[callers$1.current.strategy] || strategies.shortest;
            this.cache.forEach(function (value, key) {
                var _loop_2 = function (match, target, check) {
                    if (match.test(key)) {
                        var l_1 = extract(match, key);
                        fix(value
                            .filter(function (i) { return i.method === 'fix'; })
                            .filter(function (i) { return !check(i.target, l_1); }), target(l_1));
                        return { value: void 0 };
                    }
                };
                for (var _i = 0, staticRules_2 = staticRules; _i < staticRules_2.length; _i++) {
                    var _a = staticRules_2[_i], match = _a.match, target = _a.target, check = _a.check;
                    var state_2 = _loop_2(match, target, check);
                    if (typeof state_2 === "object")
                        return state_2.value;
                }
                fix(value, strategy(value));
            });
        },
        generate: function (key, isProd) {
            for (var _i = 0, staticRules_3 = staticRules; _i < staticRules_3.length; _i++) {
                var _a = staticRules_3[_i], match = _a.match, target = _a.target, generate = _a.generate;
                if (match.test(key)) {
                    var l = extract(match, key);
                    return isProd ? target(l) : generate(l);
                }
            }
            if (!lodash.isNumber(this.get(key)))
                this.set(key, isProd ? 0 : lodash.random(0, 10));
            return this.get(key);
        }
    };
    function fix(toBeFixed, len) {
        toBeFixed.forEach(function (item) {
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
                    arr.push.apply(arr, lodash.times(len - arr.length, mocker));
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
            return (_a = this.getInstance()).check.apply(_a, params);
        };
        IPAProxy.prototype.guarantee = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var _a;
            return (_a = this.getInstance()).guarantee.apply(_a, params);
        };
        IPAProxy.prototype.mock = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var _a;
            return (_a = this.getInstance()).mock.apply(_a, params);
        };
        return IPAProxy;
    }(IPALike));

    var bypasser = {
        check: function () { return true; },
        guarantee: function (v) { return v; },
        mock: function () { return undefined; },
    };

    var dict = 'ad,aliqua,amet,anim,aute,cillum,commodo,culpa,do,dolor,duis,elit,enim,esse,est,et,ex,fugiat,id,in,ipsum,irure,labore,lorem,magna,minim,mollit,nisi,non,nulla,officia,pariatur,quis,sint,sit,sunt,tempor,ut,velit,veniam'
        .split(',');
    var randStr = (function () { return dict[lodash.random(0, dict.length - 1)]; });

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
        .set(String, Strat(lodash.isString, lodash.toString, '', randStr, 'a string'))
        .set(Number, Strat(lodash.isNumber, function (v) { return +v || 0; }, 0, function () { return lodash.random(0, 100); }, 'a number'))
        .set(Boolean, Strat(lodash.isBoolean, function (v) { return !!v; }, false, function () { return !lodash.random(0, 1); }, 'a boolean'))
        .set(Array, Strat(lodash.isArray, lodash.toArray, [], function () { return []; }, 'an array'))
        .set(Object, Strat(lodash.isPlainObject, function () { return ({}); }, {}, function () { return ({}); }, 'a plain object'))
        .set(Function, Strat(lodash.isFunction, function () { return function () { }; }, function () { }, function () { return function () { }; }, 'a function'));
    var funcComp = {
        condition: lodash.isFunction,
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
            return lodash.isArray(template);
        },
        execute: function (template) {
            var l = template[1];
            if (l !== undefined && !lodash.isNumber(l) && !lodash.isString(l)) {
                throw new Error('compile failed: the 2nd parameter for array can only be String or Number');
            }
            l = l && l.toString();
            return function (_a) {
                var compile = _a.compile, catcher = _a.catcher;
                var compiled = compile(template[0]);
                return {
                    check: function (val) {
                        if (!lodash.isArray(val)) {
                            return catcher.catch('array');
                        }
                        if (l !== undefined) {
                            lengthManager.push(l, {
                                length: val.length,
                                key: catcher.currentKey,
                                method: 'check',
                            });
                        }
                        return every(val, function (item, index) { return catcher.wrap(index, function () { return compiled.check(item); }); });
                    },
                    guarantee: function (valIn, strict) {
                        var val = valIn;
                        var isFree = false;
                        if (!catcher.catch('an array', lodash.isArray(valIn))) {
                            val = [];
                            isFree = true;
                        }
                        else {
                            val.forEach(function (item, idx) {
                                val[idx] = catcher.wrap(idx, function () { return compiled.guarantee(item, strict); });
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
                        return lodash.times(lengthManager.generate(l, prod), function () { return compiled.mock.call(compiled, prod); });
                    },
                };
            };
        },
    };

    var booleanCompiler = {
        condition: lodash.isBoolean,
        execute: function (template) {
            return function (_a) {
                var catcher = _a.catcher;
                return ({
                    check: function (v) { return catcher.catch('boolean', lodash.isBoolean(v)); },
                    guarantee: function (v) {
                        return this.check(v) ? v : template;
                    },
                    mock: function (prod) { return prod ? template : !lodash.random(0, 1); },
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
        condition: lodash.isNumber,
        execute: function (template) {
            return function (_a) {
                var catcher = _a.catcher;
                return ({
                    check: function (v) { return catcher.catch('a number', lodash.isNumber(v)); },
                    guarantee: function (v) {
                        return this.check(v) ? v : template;
                    },
                    mock: function (prod) { return prod ? template : lodash.random(0, 100); },
                });
            };
        },
    };

    var objectCompiler = {
        condition: function (template) {
            return lodash.isPlainObject(template) && !(template instanceof IPALike);
        },
        execute: function (template) {
            return function (_a) {
                var compile = _a.compile, catcher = _a.catcher;
                var compiled = {};
                var notRequiredExp = /^(.{1,})\?$/;
                var stillRequiredExp = /^.{0,}\\\?$/;
                var isAbsent = function (v) { return v === undefined || v === null; };
                Object.entries(template).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    var rule = compile(value);
                    if (!lodash.isString(key) || !notRequiredExp.test(key)) {
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
                        return catcher.catch('a plain object', lodash.isPlainObject(val)) &&
                            every(Object.keys(compiled), function (key) { return catcher.wrap(key, function () { return compiled[key].check(val[key]); }); });
                    },
                    guarantee: function (valIn, strict) {
                        var val = valIn;
                        var process = function () {
                            Object.keys(compiled).forEach(function (key) {
                                var absent = !val.hasOwnProperty(key);
                                var result = catcher.wrap(key, function () { return compiled[key].guarantee(val[key], strict); });
                                if (absent && result === undefined)
                                    return;
                                val[key] = result;
                            });
                        };
                        if (!catcher.catch('a plain object', lodash.isPlainObject(valIn))) {
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
                        Object.keys(compiled).forEach(function (key) {
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
        condition: lodash.isString,
        execute: function (template) { return function (_a) {
            var catcher = _a.catcher, cache = _a.cache;
            var recurserScope = cache.get('$$recurseScope');
            if (recurserScope && recurserScope.marker === template) {
                return recurserScope.asset;
            }
            return {
                check: function (v) { return catcher.catch('string', lodash.isString(v)); },
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
                    return this.check(v) ? v : new (Klass.bind.apply(Klass, [void 0].concat(params)))();
                },
                mock: function () { return new (Klass.bind.apply(Klass, [void 0].concat(params)))(); },
            });
        };
    });

    var Dict = (function (template) { return function (_a) {
        var compile = _a.compile, catcher = _a.catcher;
        var compiled = compile(template);
        return {
            check: function (val) {
                return catcher.catch('a plain object', lodash.isPlainObject(val)) &&
                    every(Object.keys(val), function (k) { return catcher.wrap(k, function () { return compiled.check(val[k]); }); });
            },
            guarantee: function (val, strict) {
                if (!catcher.catch('a plain object', lodash.isPlainObject(val)))
                    return {};
                Object.keys(val).forEach(function (key) {
                    val[key] = catcher.wrap(key, function () { return compiled.guarantee(val[key], strict); });
                });
                return val;
            },
            mock: function (prod) {
                var output = {};
                lodash.range(0, prod ? 0 : lodash.random(1, 10)).forEach(function () {
                    output[randStr()] = compiled.mock(prod);
                });
                return output;
            },
        };
    }; });

    var Integer = (function (_a) {
        var catcher = _a.catcher;
        return ({
            check: function (v) { return catcher.catch('an integer', lodash.isInteger(v)); },
            guarantee: function (v, strict) {
                return this.check(v) ? v : strict ? 0 : lodash.toInteger(v);
            },
            mock: function (prod) { return prod ? 0 : lodash.random(0, 100); },
        });
    });

    var or = (function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (params.length < 2)
            throw new Error('function "or" requires at least 2 parameter');
        return function (_a) {
            var compile = _a.compile, catcher = _a.catcher;
            var rules = params.map(function (item) { return compile(item); });
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
                check: function (val) { return and(catcher.catch('a number', lodash.isNumber(val)), catcher.catch("in range [" + min + ", " + max + "]", val >= min && val <= max)); },
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
                mock: function (prod) { return prod ? min : lodash.random(min, max, isFloat); },
            };
        };
    });

    var Each = (function (template, strictLength) {
        if (strictLength === void 0) { strictLength = true; }
        var len = template.length;
        return function (_a) {
            var compile = _a.compile, catcher = _a.catcher;
            var compiled = template.map(function (item) { return compile(item); });
            return {
                check: function (val) { return catcher.catch('an array', lodash.isArray(val)) && and(catcher.catch("with length of " + len, !strictLength || val.length === len), every(compiled, function (item, i) { return catcher.wrap(i, function () { return item.check(val[i]); }); })); },
                guarantee: function (valIn, strict) {
                    var val = valIn;
                    var process = function () {
                        compiled.forEach(function (item, idx) {
                            val[idx] = catcher.wrap(idx, function () { return item.guarantee(val[idx], strict); });
                        });
                    };
                    if (!catcher.catch('an array', lodash.isArray(valIn))) {
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
                mock: function (prod) { return compiled.map(function (item) { return item.mock(prod); }); },
            };
        };
    });

    var From = (function () {
        var set = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            set[_i] = arguments[_i];
        }
        var getRandom = function () {
            var v = set[lodash.random(0, set.length - 1)];
            return lodash.cloneDeep(v);
        };
        var getFirst = function () { return lodash.cloneDeep(set[0]); };
        var msg = set.length > 1 ? "from " + set : "" + set[0];
        return function (_a) {
            var catcher = _a.catcher;
            return ({
                check: function (val) { return catcher.catch(msg, set.findIndex(function (item) { return lodash.isEqual(item, val); }) !== -1); },
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
        if (lodash.isPlainObject(temp))
            return lodash.isPlainObject;
        if (!lodash.isArray(temp))
            return function () { return false; };
        var convergeList = [/^0{1,}$/, /^>=0{1,}$/, /^<=?\d{1,}$/]; // 收敛名单
        if (!temp[1] && convergeList.some(function (i) { return i.test(temp[1]); }))
            return lodash.isArray;
        return function (v) { return lodash.isArray(v) && v.length > 0; };
    }
    var recurse = (function (subTemplate, options) { return function (_a) {
        var compile = _a.compile, cache = _a.cache, catcher = _a.catcher;
        var _b = options || {}, _c = _b.marker, marker = _c === void 0 ? '$$' : _c, _d = _b.border, border = _d === void 0 ? From(null) : _d, _e = _b.condition, condition = _e === void 0 ? getDefaultCondition(subTemplate) : _e;
        var borderCompiled = compile(border);
        var compiled = null;
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
            mock: function () { return lodash.random(1) === 0 ? borderCompiled.mock.call(borderCompiled) : compiled.mock.call(compiled); },
        };
        cache.set('$$recurseScope', {
            marker: marker,
            asset: asset,
        });
        compiled = compile(subTemplate);
        cache.delete('$$recurseScope');
        return compiled;
    }; });

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
            IPA.$emit(this, 'check', data);
            return output;
        };
        /**
         * @param {the inputting data to be guaranteed} data
         * @param {guarantee Options} isCopy
         * @param {method level errorHandler} onError
         */
        IPA.prototype.guarantee = function (data, options, onError) {
            var opt, onErr;
            if (lodash.isPlainObject(options)) {
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
            var copy = isCopy ? lodash.cloneDeep(data) : data;
            var output = this.core.guarantee(copy, isStrict);
            lengthManager.fix();
            var errorLog = catcher.getError('check', data);
            errorLog && onErr && onErr(catcher.getError('check', data));
            IPA.$emit(this, 'guarantee', data);
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
            if (!lodash.isPlainObject(settings)) {
                if (!IPA.isProductionEnv)
                    throw new Error('mocking setting  a plain object');
                settings = {};
            }
            lengthManager.digest(settings);
            var output = this.core.mock(prod);
            IPA.$emit();
            return output;
        };
        IPA.prototype.onError = function (f) {
            this.errorHandler = f;
            return this;
        };
        IPA.errorHandler = null;
        IPA.isProductionEnv = false;
        IPA.instances = new Map();
        IPA.inject = function (name, template) {
            if (IPA.instances.has(name) && !IPA.isProductionEnv) {
                throw new Error('in inject: reassign to global IPA instance is not arrowed');
            }
            IPA.instances.set(name, new IPA(template));
        };
        IPA.getInstance = function (name) {
            var i = null;
            return new IPAProxy(function () {
                if (i)
                    return i;
                i = IPA.instances.get(name);
                if (i === undefined)
                    throw new Error('in getInstance: IPA instance called before injected');
                return i;
            });
        };
        IPA.compile = compile;
        IPA.install = function (v) {
            v.prototype.$ipa = IPA.getInstance;
            v.prototype.$brew = compile;
        };
        IPA.onError = function (f) {
            IPA.errorHandler = f;
            return IPA;
        };
        IPA.$emit = function (instance, method, input) {
            var errorLog = catcher.getError(method, input);
            errorLog && instance.errorHandler && instance.errorHandler(errorLog);
            errorLog = catcher.getError(method, input);
            errorLog && IPA.errorHandler && IPA.errorHandler(errorLog);
            [lengthManager, cache, catcher].forEach(function (clearable) { return clearable.clear(); });
            callers$1.pop();
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
        return IPA;
    }(IPALike));

    return IPA;

})));
