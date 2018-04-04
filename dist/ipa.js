'use strict';

var lodash = require('lodash');

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var cacheSymbol = Symbol('cache');

var Cache = function () {
    function Cache() {
        classCallCheck(this, Cache);

        this[cacheSymbol] = new Map();
    }

    createClass(Cache, [{
        key: 'push',
        value: function push(name, item) {
            if (!lodash.isArray(this[cacheSymbol].get(name))) {
                this[cacheSymbol].set(name, []);
            }
            this[cacheSymbol].get(name).push(item);
        }
    }, {
        key: 'set',
        value: function set$$1(name, value) {
            this[cacheSymbol].set(name, value);
        }
    }, {
        key: 'get',
        value: function get$$1(name) {
            return this[cacheSymbol].get(name);
        }
    }, {
        key: 'forEach',
        value: function forEach(cb) {
            this[cacheSymbol].forEach(cb);
        }
    }, {
        key: 'reset',
        value: function reset() {
            this[cacheSymbol].clear();
        }
    }, {
        key: 'digest',
        value: function digest(settings) {
            var _this = this;

            this.reset();
            Object.keys(settings).forEach(function (key) {
                _this.set(key, settings[key]);
            });
        }
    }]);
    return Cache;
}();

var cache = new Cache();

var templateSymbol = Symbol('IPA_core');

var fixLength = function fixLength(len, item) {
    var arr = item.target;
    var mocker = item.mocker;
    if (arr.length > len) {
        arr.splice(len);
    } else {
        arr.push.apply(arr, toConsumableArray(lodash.times(len - arr.length, mocker)));
    }
};

var strategies = {
    most: function most(val) {
        var lengths = val.map(function (item) {
            return item.target.length;
        });
        var freq = new Map();
        lengths.forEach(function (length) {
            if (freq.get(length) === undefined) {
                freq.set(length, 0);
            }
            freq.set(length, freq.get(length) + 1);
        });
        var sorted = [].concat(toConsumableArray(freq)).sort(function (a, b) {
            return a[1] < b[1];
        }).map(function (item) {
            return item[0];
        });
        return sorted[0];
    },
    shortest: function shortest(val) {
        return Math.min.apply(Math, toConsumableArray(val.map(function (item) {
            return item.target.length;
        })));
    },
    longest: function longest(val) {
        return Math.max.apply(Math, toConsumableArray(val.map(function (item) {
            return item.target.length;
        })));
    },
    average: function average(val) {
        var average = lodash.mean(val.map(function (item) {
            return item.target.length;
        }));
        return Math.ceil(average);
    }
};

var fixArray = (function (strategyIn) {
    var strategy = strategies[strategyIn] || strategies.shortest;
    cache.forEach(function (value, key) {
        var targetLen = lodash.isNumber(key) ? key : strategy(value);
        value.forEach(function (item) {
            fixLength(targetLen, item);
        });
    });
});

var checkLength = (function () {
    var result = true;
    cache.forEach(function (value, key) {
        if (lodash.isNumber(key)) {
            result = result && value.filter(function (item) {
                return item !== key;
            }).length === 0;
        } else {
            result = result && lodash.min(value) === lodash.max(value);
        }
    });
    return result;
});

var arrayStrat = (function () {
    return {
        check: lodash.isArray,
        guarantee: function guarantee(val, strict) {
            return lodash.isArray(val) ? val : strict ? [] : lodash.toArray(val);
        },
        mock: function mock() {
            return [];
        }
    };
});

var booleanStrat = (function () {
    return {
        check: lodash.isBoolean,
        guarantee: function guarantee(val) {
            return !!val;
        },
        mock: function mock(prod) {
            return prod ? false : !lodash.random(0, 1);
        }
    };
});

var numberStrat = (function () {
    return {
        check: lodash.isNumber,
        guarantee: function guarantee(val, strict) {
            if (strict && !lodash.isNumber(val)) return 0;
            var n = lodash.toNumber(val);
            return !lodash.isNaN(n) && lodash.isFinite(n) ? n : 0;
        },
        mock: function mock(prod) {
            return prod ? 0 : lodash.random(0, 100);
        }
    };
});

var objectStrat = (function () {
    return {
        check: lodash.isPlainObject,
        guarantee: function guarantee(val) {
            return lodash.isPlainObject(val) ? val : {};
        },
        mock: function mock() {
            return {};
        }
    };
});

var dict = ['ad', 'aliqua', 'amet', 'anim', 'aute', 'cillum', 'commodo', 'culpa', 'do', 'dolor', 'duis', 'elit', 'enim', 'esse', 'est', 'et', 'ex', 'fugiat', 'id', 'in', 'ipsum', 'irure', 'labore', 'Lorem', 'magna', 'minim', 'mollit', 'nisi', 'non', 'nulla', 'officia', 'pariatur', 'quis', 'sint', 'sit', 'sunt', 'tempor', 'ut', 'velit', 'veniam'];

var randStr = (function () {
    return dict[lodash.random(0, dict.length - 1)];
});

var stringStrat = (function () {
    return {
        check: lodash.isString,
        guarantee: function guarantee(v, strict) {
            return lodash.isString(v) ? v : strict ? '' : lodash.toString(v);
        },
        mock: function mock(prod) {
            return prod ? '' : randStr();
        }
    };
});

var presetClasses = new Map().set(String, stringStrat).set(Number, numberStrat).set(Boolean, booleanStrat).set(Array, arrayStrat).set(Object, objectStrat);

var functionCompiler = {
    condition: lodash.isFunction,
    execute: function execute(template) {
        return presetClasses.get(template) || template;
    }
};

var ipaCompiler = {
    condition: function condition(template) {
        return !!(template && template[templateSymbol]);
    },
    execute: function execute(template) {
        return function () {
            return template[templateSymbol];
        };
    }
};

var arrayCompiler = {
    condition: function condition(template) {
        return lodash.isArray(template);
    },
    execute: function execute(template) {
        var l = template[1];
        if (l !== undefined && !lodash.isNumber(l) && !lodash.isString(l)) {
            throw new Error('compile failed: the 2nd parameter for array can only be String or Number');
        }
        return function (compile) {
            var compiled = compile(template[0]);
            return {
                check: function check(val) {
                    if (!lodash.isArray(val)) return false;
                    var result = true;
                    val.forEach(function (item) {
                        result = result && compiled.check(item);
                    });
                    if (l !== undefined) {
                        cache.push(l, val.length);
                    }
                    return result;
                },
                guarantee: function guarantee(valIn) {
                    var val = lodash.isArray(valIn) ? valIn : [];
                    val.forEach(function (item, idx) {
                        val[idx] = compiled.guarantee(item);
                    });
                    if (l !== undefined) {
                        cache.push(l, {
                            target: val,
                            mocker: compiled.mock
                        });
                    }
                    return val;
                },
                mock: function mock() {
                    var length = lodash.random(0, 10);
                    if (lodash.isNumber(l)) length = l;
                    if (lodash.isString(l)) {
                        if (lodash.isNumber(cache.get(l))) {
                            length = cache.get(l);
                        } else {
                            cache.set(l, length);
                        }
                    }
                    return lodash.times(length, compiled.mock);
                }
            };
        };
    }
};

var booleanCompiler = {
    condition: lodash.isBoolean,
    execute: function execute(template) {
        return function () {
            return {
                check: lodash.isBoolean,
                guarantee: function guarantee(v) {
                    return lodash.isBoolean(v) ? v : template;
                },
                mock: function mock() {
                    return !lodash.random(0, 1);
                }
            };
        };
    }
};

var nullCompiler = {
    condition: function condition(t) {
        return t === null;
    },
    execute: function execute() {
        return function () {
            return {
                check: function check(v) {
                    return v !== undefined;
                },
                guarantee: function guarantee(v) {
                    return v === undefined ? null : v;
                },
                mock: function mock() {
                    return null;
                }
            };
        };
    }
};

var numberCompiler = {
    condition: lodash.isNumber,
    execute: function execute(template) {
        return function () {
            return {
                check: lodash.isNumber,
                guarantee: function guarantee(v) {
                    return lodash.isNumber(v) ? v : template;
                },
                mock: function mock() {
                    return lodash.random(0, 100);
                }
            };
        };
    }
};

var objectCompiler = {
    condition: function condition(template) {
        return lodash.isPlainObject(template) && !template[templateSymbol];
    },
    execute: function execute(template) {
        return function (compile) {
            var compiled = {};
            Object.keys(template).forEach(function (key) {
                compiled[key] = compile(template[key]);
            });
            return {
                check: function check(val) {
                    if (!lodash.isPlainObject(val)) return false;
                    var result = true;
                    Object.keys(compiled).forEach(function (key) {
                        result = result && compiled[key].check(val[key]);
                    });
                    return result;
                },
                guarantee: function guarantee(valIn) {
                    var val = lodash.isPlainObject(valIn) ? valIn : {};
                    Object.keys(compiled).forEach(function (key) {
                        val[key] = compiled[key].guarantee(val[key]);
                    });
                    return val;
                },
                mock: function mock() {
                    var val = {};
                    Object.keys(compiled).forEach(function (key) {
                        val[key] = compiled[key].mock(val[key]);
                    });
                    return val;
                }
            };
        };
    }
};

var undefinedCompiler = {
    condition: function condition(t) {
        return t === undefined;
    },
    execute: function execute() {
        return function () {
            return {
                check: function check() {
                    return true;
                },
                guarantee: function guarantee(v) {
                    return v;
                },
                mock: function mock() {
                    return undefined;
                }
            };
        };
    }
};

var stringCompiler = {
    condition: lodash.isString,
    execute: function execute(template) {
        return function () {
            return {
                check: lodash.isString,
                guarantee: function guarantee(v) {
                    return lodash.isString(v) ? v : template;
                },
                mock: randStr
            };
        };
    }
};

var compilers = [functionCompiler, ipaCompiler, arrayCompiler, booleanCompiler, nullCompiler, numberCompiler, objectCompiler, undefinedCompiler, stringCompiler];

var compile = function compile(template) {
    var strategy = void 0;
    for (var i = 0; i < compilers.length; i++) {
        // eslint-disable-line
        if (compilers[i].condition(template)) {
            strategy = compilers[i].execute(template);
            break;
        }
    }
    if (!strategy) throw new Error('compile error: failed to recognize pattern ' + JSON.stringify(template));
    return strategy(compile);
};

var asClass = (function (Cls) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
    }

    if (!lodash.isFunction(Cls)) throw new Error('function "asClass" only accept constructor function as 1st parameter');
    try {
        new (Function.prototype.bind.apply(Cls, [null].concat(params)))(); // eslint-disable-line
    } catch (e) {
        throw new Error('in function "as Class", class(1st param) must match with the params(the rest params)');
    }
    return function () {
        return {
            check: function check(v) {
                return v instanceof Cls;
            },
            guarantee: function guarantee(v) {
                return v instanceof Cls ? v : new (Function.prototype.bind.apply(Cls, [null].concat(params)))();
            },
            mock: function mock() {
                return new (Function.prototype.bind.apply(Cls, [null].concat(params)))();
            }
        };
    };
});

var Dict = (function (template) {
    return function (compile) {
        var compiled = compile(template);
        return {
            check: function check(val) {
                if (!lodash.isPlainObject(val)) return false;
                var result = true;
                Object.values(val).forEach(function (value) {
                    result = result && compiled.check(value);
                });
                return result;
            },
            guarantee: function guarantee(valIn) {
                var val = valIn;
                if (!lodash.isPlainObject(val)) return {};
                Object.keys(val).forEach(function (key) {
                    val[key] = compiled.guarantee(val[key]);
                });
                return val;
            },
            mock: function mock() {
                var output = {};
                lodash.range(0, lodash.random(1, 10)).forEach(function () {
                    output[randStr()] = compiled.mock();
                });
                return output;
            }
        };
    };
});

var Integer = (function () {
    return {
        check: lodash.isInteger,
        guarantee: lodash.toInteger,
        mock: function mock() {
            return lodash.random(0, 1000);
        }
    };
});

var or = (function () {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
    }

    if (params.length === 0) throw new Error('function "or" requires at least 1 parameter');
    return function (compile) {
        var rules = params.map(function (item) {
            return compile(item);
        });
        return {
            check: function check(val) {
                var result = false;
                rules.forEach(function (rule) {
                    result = result || rule.check(val);
                });
                return result;
            },
            guarantee: function guarantee(val) {
                return this.check(val) ? val : rules[0].guarantee(val);
            },
            mock: function mock() {
                return rules[0].mock();
            }
        };
    };
});

var Range = (function (min, max) {
    var isFloat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!lodash.isNumber(min) || !lodash.isNumber(max)) {
        throw new Error('function "Range" only accept Number as 1st & 2nd parameters');
    }
    if (min > max) {
        throw new Error('in function "Range", min(1st param) must be no larger than max(2st param)');
    }
    return function () {
        return {
            check: function check(val) {
                return lodash.isNumber(val) && val >= min && val <= max;
            },
            guarantee: function guarantee(val) {
                if (!lodash.isNumber(val)) return (min + max) / 2;
                if (val < min) return min;
                if (val > min) return max;
                return val;
            },
            mock: function mock() {
                return lodash.random(min, max, isFloat);
            }
        };
    };
});

var Each = (function (template) {
    var strictLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (!lodash.isArray(template)) throw new Error('function "Each" only accepts array as parameter');
    return function (compile) {
        var compiled = template.map(function (item) {
            return compile(item);
        });
        return {
            check: function check(val) {
                if (!lodash.isArray(val)) return false;
                var result = strictLength ? val.length === template.length : true;
                compiled.forEach(function (item, idx) {
                    result = result && item.check(val[idx]);
                });
                return result;
            },
            guarantee: function guarantee(valIn) {
                var val = lodash.isArray(valIn) ? valIn : [];
                compiled.forEach(function (item, idx) {
                    val[idx] = item.guarantee(val[idx]);
                });
                if (strictLength) {
                    val.splice(compiled.length);
                }
                return val;
            },

            mock: function mock() {
                return compiled.map(function (item) {
                    return item.mock();
                });
            }
        };
    };
});

var From = (function (template) {
    var isJSONcompare = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var set = [];
    try {
        template.forEach(function (v) {
            if (lodash.isObject(v)) {
                try {
                    JSON.stringify(v);
                } catch (e) {
                    throw new Error('params of function "From" containes un-stringifiable object, most probably circular object');
                }
            }
            set.push(v);
        });
    } catch (e) {
        throw new Error('function "From" only accepts iterable objects');
    }
    var n = set.length;
    var getRandom = function getRandom() {
        var v = set[lodash.random(0, n - 1)];
        return isJSONcompare ? lodash.cloneDeep(v) : v;
    };
    return function () {
        return {
            check: function check(val) {
                for (var i = 0; i < n; i++) {
                    // eslint-disable-line
                    if (!isJSONcompare && set[i] === val) {
                        // strict compare
                        return true;
                    }
                    if (isJSONcompare) {
                        var result = void 0;
                        try {
                            result = JSON.stringify(set[i]) === JSON.stringify(val);
                        } catch (e) {
                            continue; // eslint-disable-line
                        }
                        if (result) return true;
                    }
                }
                return false;
            },
            guarantee: function guarantee(val) {
                return this.check(val) ? val : getRandom();
            },

            mock: getRandom
        };
    };
});

var publicExposed = {
    asClass: asClass,
    Dict: Dict,
    Integer: Integer,
    or: or,
    Range: Range,
    Each: Each,
    From: From
};

var IPA = function () {
    function IPA(template) {
        classCallCheck(this, IPA);

        this[templateSymbol] = compile(template);
        this.strategy = 'shortest';
    }

    createClass(IPA, [{
        key: 'check',
        value: function check(data) {
            var output = this[templateSymbol].check(data) && checkLength();
            cache.reset();
            return output;
        }

        /**
         * 
         * @param {the inputting data to be guaranteed} data
         * @param {whether to make a deep copy first} isCopy
         * @param {whether to use the strict mode} strict
         */

    }, {
        key: 'guarantee',
        value: function guarantee(data) {
            var isCopy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var copy = isCopy ? lodash.cloneDeep(data) : data;
            var output = this[templateSymbol].guarantee(copy, strict);
            fixArray(this.strategy);
            cache.reset();
            return output;
        }

        /**
         * 
         * @param {the mock setting for array length} settings 
         * @param {whether it's in production environment} prod 
         */

    }, {
        key: 'mock',
        value: function mock() {
            var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var prod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!lodash.isPlainObject(settings)) {
                throw new Error('mocking setting should be a plain object');
            }
            cache.digest(settings);
            var output = this[templateSymbol].mock(prod);
            cache.reset();
            return output;
        }
    }]);
    return IPA;
}();

var instances = new Map();

IPA.inject = function (name, template) {
    return instances.set(name, new IPA(template));
};

IPA.getInstance = function (name) {
    return instances.get(name);
};

IPA.$compile = compile;

IPA.install = function (v) {
    var w = v;
    w.prototype.$ipa = IPA.getInstance;
    w.prototype.$brew = IPA.$compile;
};

Object.assign(IPA, publicExposed);

module.exports = IPA;
