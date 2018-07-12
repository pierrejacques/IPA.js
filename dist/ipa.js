'use strict';

var lodash = require('lodash');

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

var IPALike = /** @class */ (function () {
    function IPALike() {
    }
    IPALike.prototype.check = function (data) { return true; };
    IPALike.prototype.guarantee = function (data, isDeep, isStrict) { };
    IPALike.prototype.mock = function (config, isProdEnv) { };
    return IPALike;
}());

var _a;
var _cache_ = Symbol('cache');
var Cache = /** @class */ (function () {
    function Cache() {
        this[_a] = new Map();
    }
    Cache.prototype.push = function (name, item) {
        if (!lodash.isArray(this[_cache_].get(name))) {
            this[_cache_].set(name, []);
        }
        this[_cache_].get(name).push(item);
    };
    Cache.prototype.set = function (name, value) {
        this[_cache_].set(name, value);
    };
    Cache.prototype.get = function (name) {
        return this[_cache_].get(name);
    };
    Cache.prototype.forEach = function (cb) {
        this[_cache_].forEach(cb);
    };
    Cache.prototype.reset = function () {
        this[_cache_].clear();
    };
    Cache.prototype.digest = function (settings) {
        var _this = this;
        this.reset();
        Object.keys(settings).forEach(function (key) {
            _this.set(key, settings[key]);
        });
    };
    return Cache;
}());
_a = _cache_;
var privateCache = new Cache();
var publicCache = new Cache();

var Catcher = /** @class */ (function () {
    function Catcher() {
        this._logMap = {};
        this.stack = [];
        this.isFree = false;
        this.clear();
    }
    Catcher.prototype.clear = function () {
        this._logMap = {};
        this.stack = [];
    };
    Catcher.prototype.pop = function () {
        this.stack.pop();
    };
    Catcher.prototype.push = function (key) {
        var keyStr = typeof key === 'string' ? "." + key : "[" + key + "]";
        this.stack.push(keyStr);
    };
    Catcher.prototype.catch = function (msg, result) {
        if (result === void 0) { result = false; }
        if (!result) {
            this.log(this.currentKey, "should be " + msg);
        }
        return result;
    };
    Catcher.prototype.wrap = function (key, getResult) {
        this.push(key);
        var result = getResult();
        this.pop();
        return result;
    };
    Catcher.prototype.log = function (key, msg) {
        if (this.isFree)
            return;
        var prefix = 'it';
        if (key === '') {
            prefix = 'itself';
        }
        this._logMap["" + prefix + key] = msg;
    };
    Catcher.prototype.free = function (callback) {
        this.isFree = true;
        var result = callback();
        this.isFree = false;
        return result;
    };
    Object.defineProperty(Catcher.prototype, "logMap", {
        get: function () {
            return this._logMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Catcher.prototype, "currentKey", {
        get: function () {
            return this.stack.join('');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Catcher.prototype, "hasLog", {
        get: function () {
            return Object.keys(this._logMap).length > 0;
        },
        enumerable: true,
        configurable: true
    });
    return Catcher;
}());
var catcher = new Catcher();

var fixLength = function (len, item) {
    var arr = item.target;
    var mocker = item.mocker;
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
};
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
var fixer = function (strategyIn) {
    var strategy = strategies[strategyIn] || strategies.shortest;
    privateCache.forEach(function (value, key) {
        var targetLen = lodash.isNumber(key) ? key : strategy(value);
        value.forEach(function (item) {
            fixLength(targetLen, item);
        });
    });
};

var checkLength = (function () {
    var result = true;
    privateCache.forEach(function (value, key) {
        if (lodash.isNumber(key)) {
            value.forEach(function (item) {
                if (item.length !== key) {
                    catcher.log(item.key, "length unequals to " + key);
                    result = false;
                }
            });
        }
        else {
            var lengths = value.map(function (item) { return item.length; });
            if (lodash.min(lengths) !== lodash.max(lengths)) {
                result = false;
                value.forEach(function (item) { return catcher.log(item.key, 'length unmatched'); });
            }
        }
    });
    return result;
});

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
var createProxy = (function (getInstance) { return new IPAProxy(getInstance); });

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

// full checked every method
var every = (function (arr, handler) {
    return arr.map(handler).every(function (v) { return v; });
});

var arrayCompiler = {
    condition: function (template) {
        return lodash.isArray(template);
    },
    execute: function (template) {
        var l = template[1];
        if (l !== undefined && !lodash.isNumber(l) && !lodash.isString(l)) {
            throw new Error('compile failed: the 2nd parameter for array can only be String or Number');
        }
        return function (_a) {
            var compile = _a.compile, catcher = _a.catcher;
            var compiled = compile(template[0]);
            return {
                check: function (val) {
                    if (!lodash.isArray(val)) {
                        return catcher.catch('array');
                    }
                    if (l !== undefined) {
                        privateCache.push(l, {
                            length: val.length,
                            key: catcher.currentKey,
                        });
                    }
                    return catcher.catch('a correct array', every(val, function (item, index) {
                        return catcher.wrap(index, function () { return compiled.check(item); });
                    }));
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
                        privateCache.push(l, {
                            target: val,
                            key: catcher.currentKey,
                            isFree: isFree,
                            mocker: function () { return compiled.guarantee(undefined, strict); },
                        });
                    }
                    return val;
                },
                mock: function (prod) {
                    var length = prod ? 0 : lodash.random(0, 10);
                    if (lodash.isNumber(l))
                        length = l;
                    if (lodash.isString(l)) {
                        if (lodash.isNumber(privateCache.get(l))) {
                            length = privateCache.get(l);
                        }
                        else {
                            privateCache.set(l, length);
                        }
                    }
                    return lodash.times(length, function () { return compiled.mock(prod); });
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
            Object.keys(template).forEach(function (key) {
                compiled[key] = compile(template[key]);
            });
            return {
                check: function (val) {
                    return catcher.catch('a plain object', lodash.isPlainObject(val)) &&
                        catcher.catch('a correct object', every(Object.keys(compiled), function (key) { return catcher.wrap(key, function () { return compiled[key].check(val[key]); }); }));
                },
                guarantee: function (valIn, strict) {
                    var val = catcher.catch('a plain object', lodash.isPlainObject(valIn)) ? valIn : {};
                    Object.keys(compiled).forEach(function (key) {
                        val[key] = catcher.wrap(key, function () { return compiled[key].guarantee(val[key], strict); });
                    });
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
        var catcher = _a.catcher;
        return ({
            check: function (v) { return catcher.catch('string', lodash.isString(v)); },
            guarantee: function (v) {
                return this.check(v) ? v : template;
            },
            mock: function (prod) { return prod ? template : randStr(); },
        });
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
    cache: publicCache,
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
                catcher.catch('a dictionary object', every(Object.keys(val), function (k) { return catcher.wrap(k, function () { return compiled.check(val[k]); }); }));
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

// full checked AND logic
var and = (function () {
    var bools = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        bools[_i] = arguments[_i];
    }
    return bools.every(function (i) { return i; });
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
            check: function (val) { return catcher.catch('an array', lodash.isArray(val)) && and(catcher.catch("with length of " + len, !strictLength || val.length === len), catcher.catch('a correct array', every(compiled, function (item, i) { return catcher.wrap(i, function () { return item.check(val[i]); }); }))); },
            guarantee: function (valIn, strict) {
                var val = valIn;
                var process = function () {
                    compiled.forEach(function (item, idx) {
                        val[idx] = catcher.wrap(idx, function () { return item.guarantee(val[idx], strict); });
                    });
                };
                if (!lodash.isArray(valIn)) {
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
    return function (_a) {
        var catcher = _a.catcher;
        return ({
            check: function (val) { return catcher.catch("from " + set, set.findIndex(function (item) { return lodash.isEqual(item, val); }) !== -1); },
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
    IPA.prototype.check = function (data) {
        var output = and(this.core.check(data), checkLength());
        IPA.log(this, 'check', data);
        return output;
    };
    /**
     * @param {the inputting data to be guaranteed} data
     * @param {whether to make a deep copy first} isCopy
     * @param {whether to use the strict mode} strict
     */
    IPA.prototype.guarantee = function (data, isCopy, strict) {
        if (isCopy === void 0) { isCopy = true; }
        if (strict === void 0) { strict = false; }
        var copy = isCopy ? lodash.cloneDeep(data) : data;
        var output = this.core.guarantee(copy, strict);
        fixer(this.strategy);
        IPA.log(this, 'guarantee', data);
        return output;
    };
    /**
     * @param {the mock setting for array length} settings
     * @param {whether it's in production environment} prod
     */
    IPA.prototype.mock = function (settingsIn, prod) {
        if (settingsIn === void 0) { settingsIn = {}; }
        if (prod === void 0) { prod = IPA.isProductionEnv; }
        var settings = settingsIn;
        if (!lodash.isPlainObject(settings)) {
            if (!IPA.isProductionEnv)
                throw new Error('mocking setting  a plain object');
            settings = {};
        }
        privateCache.digest(settings);
        var output = this.core.mock(prod);
        IPA.log();
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
        return createProxy(function () {
            if (i)
                return i;
            i = IPA.instances.get(name);
            if (i === undefined)
                throw new Error('in getInstance: IPA instance called before injected');
            return i;
        });
    };
    IPA.$compile = compile;
    IPA.install = function (v) {
        v.prototype.$ipa = IPA.getInstance;
        v.prototype.$brew = IPA.$compile;
    };
    IPA.onError = function (f) {
        IPA.errorHandler = f;
        return IPA;
    };
    IPA.log = function (instance, method, input) {
        privateCache.reset();
        publicCache.reset();
        if (instance && catcher.hasLog) {
            var log = {
                method: method,
                input: input,
                exceptions: catcher.logMap,
            };
            instance.errorHandler && instance.errorHandler(log);
            IPA.errorHandler && IPA.errorHandler(log);
        }
        catcher.clear();
    };
    IPA.asClass = asClass;
    IPA.assemble = assemble;
    IPA.Dict = Dict;
    IPA.Each = Each;
    IPA.From = From;
    IPA.Integer = Integer;
    IPA.or = or;
    IPA.Range = Range;
    return IPA;
}(IPALike));

module.exports = IPA;
