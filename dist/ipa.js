"use strict";function _interopDefault(n){return n&&"object"==typeof n&&"default"in n?n.default:n}var _=require("lodash"),___default=_interopDefault(_),classCallCheck=function(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")},createClass=function(){function n(n,t){for(var e=0;e<t.length;e++){var r=t[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}return function(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}}(),toConsumableArray=function(n){if(Array.isArray(n)){for(var t=0,e=Array(n.length);t<n.length;t++)e[t]=n[t];return e}return Array.from(n)},_cache_=Symbol("cache"),Cache=function(){function n(){classCallCheck(this,n),this[_cache_]=new Map}return createClass(n,[{key:"push",value:function(n,t){_.isArray(this[_cache_].get(n))||this[_cache_].set(n,[]),this[_cache_].get(n).push(t)}},{key:"set",value:function(n,t){this[_cache_].set(n,t)}},{key:"get",value:function(n){return this[_cache_].get(n)}},{key:"forEach",value:function(n){this[_cache_].forEach(n)}},{key:"reset",value:function(){this[_cache_].clear()}},{key:"digest",value:function(n){var t=this;this.reset(),Object.keys(n).forEach(function(e){t.set(e,n[e])})}}]),n}(),cache=new Cache,_core_=Symbol("IPA_core"),fixLength=function(n,t){var e=t.target,r=t.mocker;e.length>n?e.splice(n):e.push.apply(e,toConsumableArray(_.times(n-e.length,r)))},strategies={most:function(n){var t=n.map(function(n){return n.target.length}),e=new Map;return t.forEach(function(n){void 0===e.get(n)&&e.set(n,0),e.set(n,e.get(n)+1)}),[].concat(toConsumableArray(e)).sort(function(n,t){return n[1]<t[1]}).map(function(n){return n[0]})[0]},shortest:function(n){return Math.min.apply(Math,toConsumableArray(n.map(function(n){return n.target.length})))},longest:function(n){return Math.max.apply(Math,toConsumableArray(n.map(function(n){return n.target.length})))},average:function(n){var t=_.mean(n.map(function(n){return n.target.length}));return Math.ceil(t)}},fixer=function(n){var t=strategies[n]||strategies.shortest;cache.forEach(function(n,e){var r=_.isNumber(e)?e:t(n);n.forEach(function(n){fixLength(r,n)})})};Object.assign(fixer,strategies);var checkLength=function(){var n=!0;return cache.forEach(function(t,e){n=_.isNumber(e)?n&&0===t.filter(function(n){return n!==e}).length:n&&_.min(t)===_.max(t)}),n},g=["check","guarantee","mock",_core_],b=["strategy"],createProxy=function(n){var t={};return g.forEach(function(e){Object.defineProperty(t,e,{get:function(){return n()[e]}})}),b.forEach(function(e){Object.defineProperty(t,e,{set:function(){return n()[e]},get:function(){return n()[e]}})}),t},dict=["ad","aliqua","amet","anim","aute","cillum","commodo","culpa","do","dolor","duis","elit","enim","esse","est","et","ex","fugiat","id","in","ipsum","irure","labore","Lorem","magna","minim","mollit","nisi","non","nulla","officia","pariatur","quis","sint","sit","sunt","tempor","ut","velit","veniam"],randStr=function(){return dict[_.random(0,dict.length-1)]},S=function(n,t,e,r){return function(){return{check:n,guarantee:function(r,c){return n(r)?r:c?e:t(r)},mock:function(n){return n?e:r()}}}},presets=new Map([[String,S(_.isString,_.toString,"",randStr)],[Number,S(_.isNumber,function(n){var t=_.toNumber(n);return!isNaN(t)&&isFinite(t)?t:0},0,function(){return _.random(0,100)})],[Boolean,S(_.isBoolean,function(n){return!!n},!1,function(){return!_.random(0,1)})],[Array,S(_.isArray,_.toArray,[],function(){return[]})],[Object,S(_.isPlainObject,function(){return{}},{},function(){return{}})]]),bypass={check:function(){return!0},guarantee:function(n){return n},mock:function(){}},funcComp={condition:_.isFunction,execute:function(n){return presets.has(n)?presets.get(n):function(t){return{check:n(t).check||bypass.check,guarantee:n(t).guarantee||bypass.guarantee,mock:n(t).mock||bypass.mock}}}},ipaComp={condition:function(n){return!(!n||!n[_core_])},execute:function(n){return function(){return n[_core_]}}},arrComp={condition:function(n){return _.isArray(n)},execute:function(n){var t=n[1];if(void 0!==t&&!_.isNumber(t)&&!_.isString(t))throw new Error("compile failed: the 2nd parameter for array can only be String or Number");return function(e){var r=e(n[0]);return{check:function(n){return!!_.isArray(n)&&(void 0!==t&&cache.push(t,n.length),n.every(function(n){return r.check(n)}))},guarantee:function(n,e){var c=_.isArray(n)?n:[];return c.forEach(function(n,t){c[t]=r.guarantee(n,e)}),void 0!==t&&cache.push(t,{target:c,mocker:function(){return r.guarantee(void 0,e)}}),c},mock:function(n){var e=n?0:_.random(0,10);return _.isNumber(t)&&(e=t),_.isString(t)&&(_.isNumber(cache.get(t))?e=cache.get(t):cache.set(t,e)),_.times(e,function(){return r.mock(n)})}}}}},boolComp={condition:_.isBoolean,execute:function(n){return function(){return{check:_.isBoolean,guarantee:function(t){return _.isBoolean(t)?t:n},mock:function(t){return t?n:!_.random(0,1)}}}}},nullComp={condition:function(n){return null===n},execute:function(){return function(){return{check:function(n){return void 0!==n},guarantee:function(n){return void 0===n?null:n},mock:function(){return null}}}}},numComp={condition:_.isNumber,execute:function(n){return function(){return{check:_.isNumber,guarantee:function(t){return _.isNumber(t)?t:n},mock:function(t){return t?n:_.random(0,100)}}}}},objComp={condition:function(n){return _.isPlainObject(n)&&!n[_core_]},execute:function(n){return function(t){var e={};return Object.keys(n).forEach(function(r){e[r]=t(n[r])}),{check:function(n){return!!_.isPlainObject(n)&&Object.keys(e).every(function(t){return e[t].check(n[t])})},guarantee:function(n,t){var r=_.isPlainObject(n)?n:{};return Object.keys(e).forEach(function(n){r[n]=e[n].guarantee(r[n],t)}),r},mock:function(n){var t={};return Object.keys(e).forEach(function(r){t[r]=e[r].mock(n)}),t}}}}},undefinedComp={condition:function(n){return void 0===n},execute:function(){return function(){return{check:function(){return!0},guarantee:function(n){return n},mock:function(){}}}}},strComp={condition:_.isString,execute:function(n){return function(){return{check:_.isString,guarantee:function(t){return _.isString(t)?t:n},mock:function(t){return t?n:randStr()}}}}},compilers=[funcComp,ipaComp,arrComp,boolComp,nullComp,numComp,objComp,undefinedComp,strComp],compile=function n(t){var e=compilers.find(function(n){return n.condition(t)});if(!e)throw new Error("compile error: failed to recognize pattern "+JSON.stringify(t));return e.execute(t)(n)},asClass=function(n){for(var t=arguments.length,e=Array(t>1?t-1:0),r=1;r<t;r++)e[r-1]=arguments[r];if(!_.isFunction(n))throw new Error('function "asClass" only accept constructor function as 1st parameter');try{new(Function.prototype.bind.apply(n,[null].concat(e)))}catch(n){throw new Error('in function "as Class", class(1st param) must match with the params(the rest params)')}return function(){return{check:function(t){return t instanceof n},guarantee:function(t){return t instanceof n?t:new(Function.prototype.bind.apply(n,[null].concat(e)))},mock:function(){return new(Function.prototype.bind.apply(n,[null].concat(e)))}}}},Dict=function(n){return function(t){var e=t(n);return{check:function(n){if(!_.isPlainObject(n))return!1;var t=!0;return Object.values(n).forEach(function(n){t=t&&e.check(n)}),t},guarantee:function(n,t){var r=n;return _.isPlainObject(r)?(Object.keys(r).forEach(function(n){r[n]=e.guarantee(r[n],t)}),r):{}},mock:function(n){var t={};return _.range(0,n?0:_.random(1,10)).forEach(function(){t[randStr()]=e.mock(n)}),t}}}},Integer=function(){return{check:function(n){return _.isInteger(n)},guarantee:function(n,t){return _.isInteger(n)?n:t?0:_.toInteger(n)},mock:function(n){return n?0:_.random(0,100)}}},or=function(){for(var n=arguments.length,t=Array(n),e=0;e<n;e++)t[e]=arguments[e];if(0===t.length)throw new Error('function "or" requires at least 1 parameter');return function(n){var e=t.map(function(t){return n(t)});return{check:function(n){var t=!1;return e.forEach(function(e){t=t||e.check(n)}),t},guarantee:function(n,t){return this.check(n)?n:e[0].guarantee(n,t)},mock:function(n){return e[0].mock(n)}}}},Range=function(n,t){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(!_.isNumber(n)||!_.isNumber(t))throw new Error('function "Range" only accept Number as 1st & 2nd parameters');if(n>t)throw new Error('in function "Range", min(1st param) must be no larger than max(2st param)');return function(r){var c=r(Number);return{check:function(e){return _.isNumber(e)&&e>=n&&e<=t},guarantee:function(e,r){var o=c.guarantee(e,r);return o<n?n:o>t?t:o},mock:function(r){return r?n:_.random(n,t,e)}}}},Each=function(n){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(!_.isArray(n))throw new Error('function "Each" only accepts array as parameter');return function(e){var r=n.map(function(n){return e(n)});return{check:function(e){if(!_.isArray(e))return!1;var c=!t||e.length===n.length;return r.forEach(function(n,t){c=c&&n.check(e[t])}),c},guarantee:function(n,e){var c=_.isArray(n)?n:[];return r.forEach(function(n,t){c[t]=n.guarantee(c[t],e)}),t&&c.splice(r.length),c},mock:function(n){return r.map(function(t){return t.mock(n)})}}}},From=function(){for(var n=arguments.length,t=Array(n),e=0;e<n;e++)t[e]=arguments[e];var r=t.length,c=function(){var n=t[_.random(0,r-1)];return _.cloneDeep(n)};return function(){return{check:function(n){for(var e=0;e<r;e++)if(_.isEqual(t[e],n))return!0;return!1},guarantee:function(n,e){return this.check(n)?n:e?t[0]:c()},mock:function(n){return n?_.cloneDeep(t[0]):c()}}}},publicExposed={asClass:asClass,Dict:Dict,Integer:Integer,or:or,Range:Range,Each:Each,From:From},isProductionEnv=!1,_strat_=Symbol("strategy"),IPA=function(){function n(t){classCallCheck(this,n),this[_core_]=compile(t),this[_strat_]="shortest"}return createClass(n,[{key:"check",value:function(n){var t=this[_core_].check(n)&&checkLength();return cache.reset(),t}},{key:"guarantee",value:function(n){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=t?___default.cloneDeep(n):n,c=this[_core_].guarantee(r,e);return fixer(this.strategy),cache.reset(),c}},{key:"mock",value:function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:isProductionEnv,e=n;if(!___default.isPlainObject(e)){if(!isProductionEnv)throw new Error("mocking setting should be a plain object");e={}}cache.digest(e);var r=this[_core_].mock(t);return cache.reset(),r}},{key:"strategy",set:function(n){if(fixer[n])this[_strat_]=n;else if(!isProductionEnv)throw new Error('in IPA strategy setter: invalid strategy "'+n+'"')},get:function(){return this[_strat_]}}]),n}(),instances=new Map;IPA.inject=function(n,t){if(instances.has(n)&&!isProductionEnv)throw new Error("in inject: reassign to global IPA instance is not arrowed");instances.set(n,new IPA(t))},IPA.getInstance=function(n){var t=null;return createProxy(function(){if(t)return t;if(void 0===(t=instances.get(n)))throw new Error("in getInstance: IPA instance called before injected");return t})},IPA.$compile=compile,IPA.install=function(n){var t=n;t.prototype.$ipa=IPA.getInstance,t.prototype.$brew=IPA.$compile},Object.assign(IPA,publicExposed),Object.defineProperty(IPA,"isProductionEnv",{set:function(n){isProductionEnv=!!n},get:function(){return isProductionEnv}}),module.exports=IPA;
