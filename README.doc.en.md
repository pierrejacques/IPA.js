# IPA.js runtime interface checker

- faster developing
- easier maintaining
- robuster application


```
               _____                      _____ _____                _____ _____               
              /\    \                    /::::::\    \              /::::::\    \              
             /::\    \                  /::::::::\    \            /::::::::\    \             
            /:::/    /                 /:::/--\:::\    \          /:::/--\:::\    \            
           /:::/    /                 /:::/   _\:::\    \        /:::/   _\:::\    \           
          /:::/____/                 /:::/   /  |:::|    |      /:::/   /  \:::\    \          
         /::::\    \                /:::/   /   |:::| __ |     /:::/   /   /::::\    \         
        /::::::\    \              /:::/   /   /:::/    /     /:::/   /   /::::::\    \        
       /:::/\:::\    \            /:::/___/   /:::/    /      |:::|   |  /:::/\:::\    \       
       \::/  \:::\    \           \:::\   \  /:::/    /       |:::|   | /:::/  \:::\____\      
        \/___/\:::\    \ ____      \:::\   \/:::/    /        \:::\   \/:::/    \::/    /      
               \:::\    /\    \     \:::\  /:::/    /          \:::\  /:::/    / \/____/       
                \:::\  /::\ ___\     \:::\/:::/    /            \:::\/:::/    /                
                 \:::\/:::/    /      \::::::/    /              \::::::/    /                 
                  \::::::/    /        \::::/____/                \::::/____/                  
                   \::::/    /          \:::\    \                 \:::\    \                  
                   /:::/    /            \:::\    \                 \:::\    \                 
                  /:::/    /              \:::\    \                 \:::\    \                
                 /:::/    /                \:::\____\                 \:::\____\               
                 \::/    /                  \::/    /                  \::/    /               
                  \/____/                    \/____/                    \/____/                
```

## WHAT IPA DOES
IPA.js is an interface data manager. It helps you to check and guarantee your incoming data structure, and generate valid data when developing.

It can deal with deep object structures:

<img src="https://github.com/pierrejacques/IPA.js/blob/master/img/deep-object.jpg" width="800" style="margin: auto" />

as well as length-match-demanded structures which is common in data visualization cases:

<img src="https://github.com/pierrejacques/IPA.js/blob/master/img/arr-length.jpg" width="850" style="margin: auto" />

Following the valid structure, it can even generate mocking data during developing:

<img src="https://github.com/pierrejacques/IPA.js/blob/master/img/mocking.jpg" width="700" style="margin: auto" />

## WHY NEEDED
If you're working on an e2e project or large-scale application which contains a lot of data flows between modules/ends _(e.g Components in MV* frameworks)_, you can't always be sure that the incoming data is of a valid structure. Hand checking the data structure is often tedious, messy and risk-taking especially when the structure is 'deep'. Thus skipping this checking is what people usually do, which may seriously threaten the robustness. Besides, the later maintainers may have no idea on the structure if the incoming data until checking a bunch of codes.

IPA.js helps to solve the problems above by managing the data structure with **check, guarantee** and **mock** methods. The _**template object**_ helps to explicitly state the incoming data so that the current developers and future maintainers can quick get an idea on how the data structure looks like.


## GET STARTED

### installation

IPA.js is designed for node.js implementation, install with npm:

``` shell
$ npm install --save-dev ipa.js
```
import in your project files
``` javascript
import IPA from 'ipa.js'
```

### overview
IPA.js provides an _**IPA class**_ to realize its functions. Its instances are created using _**template object**_ which describes the valid structure of the incoming data.

``` javascript
import IPA from 'ipa.js' // import class IPA

const weekDataTemplate = { // create a template object
    x: [Number, 'l'],
    y: [String, 'l'],
};

const weekDataIpa = new IPA(weekDataTemplate); // create an IPA instance
```

Each instance has three major methods:  _check_, _guarantee_ and _mock_:
- **check**: checks the validity of the incoming data:

``` javascript
weekDataIpa.check({
    x: [0.1, 0.15, 0.07],
    y: ['Mon', 'Tue', 'Wed'],
}); // true

weekDataIpa.check({
    x: [0.1, 0.15, 0.07],
    y: ['Mon'],
}); // false (length unmatched)
```

- **guarantee**: guarantee to return a valid version of the incoming data:

``` javascript
// this configs the length strategy to be 'shortest' (unnecessary)
weekDataIpa.setConfig({ strategy: 'shortest' });

const incomingData = {
    x: [0.1, 0.15, 0.07],
    y: ['Mon', 'Tue'],
};

weekDataIpa.guarantee(); // {"x":[0.1,0.15],"y":["Mon","Tue"]}
```

- **mock**: mock data when developing:

``` javascript
// config the mocking dictionary (unnecessary)
weekDataIpa.setConfig({ dict: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] });

weekDataIpa.mock() // {"x":[2,5,3,5,15,17],"y":["Thu","Tue","Tue","Thu","Fri","Wed"]}

// fix the length param 'l' to constant 2
weekDataIpa.mock({ l: 2 }); // {"x":[8,17],"y":["Fri","Mon"]}
```

The behaviour of the instance can be set and get using methods _setConfig_ and _getConfig_.

### template object
The _**template object**_ describes the structure of the data.

For example:
``` javascript
{
    x: [Number, 'l'],
    y: [String, 'l'],
}
```
describes a data structure that:

-  should be a plain object who has properties named _**x**_ and _**y**_.
-  Both _**x**_ and _**y**_ are arrays.
-  _**x**_ contains numbers while _**y**_ contains strings.
-  _**x**_ and _**y**_ should have same lengths, which is quite common in data-visualization scenerios.

Initially designed for JSON structure checking, IPA currently does **not** well support data that can't be present in JSON form _(e.g Symbol, Set, Map, RegExp etc.)_. The following introduces the basic strategies for _template object_.

**- required**

Use `null` to represent required data/property.

``` javascript
const singleRequired = new IPA(null); // data
const propertyRequired = new IPA({ x: null }); // property
```

The `.check` method returns `false` when the data/property is `undefined`:

``` javascript
singleRequired.check(null); // true
singleRequired.check(undefined); // false

propertyRequired.check({}); // false
propertyRequired.check({ x: null }); // true
propertyRequired.check({ x: undefined }); // false
```

The `.guarantee` method returns `null` when the data/property is `undefined`. The `.mock` method also directly returns `null`:

``` javascript
singleRequired.guarantee(); // null
singleRequired.mock(); // null

propertyRequired.guarantee({ x: undefined }); // { x: null }
propertyRequired.mock(); // { x: null }
```



**- type**

Use a JSON-arrowed constructor to represent the valid type of the data/property, which iterally means `Number`, `String`, `Boolean`, `Object` and `Array`.
``` javascript
const num = new IPA(Number);
const str = new IPA(String);
const bool = new IPA(Boolean);
const obj = new IPA(Object);
const arr = new IPA(Array);
```

The `.check` method returns `false` when the data/property has wrong type.

``` javascript
num.check(''); // false
str.check({}); // false
bool.check(1); // false
obj.check([]); // false
arr.check({}); // false
```

The `.guarantee` method returns a common valid value when invalid.

``` javascript
num.guarantee(null); // 0
str.guarantee(null); // ''
bool.guarantee(null); // false
obj.guarantee([]); // {}
arr.guarantee({}); // []
```

The `.mock` method returns a random valid value based on the _generating configs_.
``` javascript
num.mock(); // 12
str.mock(); // 'ipsum'
bool.mock(); // false
obj.mock(); // {} (always)
arr.mock(); // [] (always)
```

> The related config keys are:
> - **min** (_Number_, default: 0): the lower bound of `Number` type
> - **max** (_Number_, default: 20): the upper bound of `Number` type
> - **dict** (_Array_, default: a group of Latin words): the dictionary from which the `String` type mocks its value.

You may use `.setConfig` method to set those keys for your instance:

``` javascript
num.setConfig({ min: -100, max: 100 });
num.mock(); // -23

str.setConfig( dict: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
str.mock(); // 'Wed'
```

**- default**

Use a JSON-allowed non-object value(other than null) to set the default value of the data/property.

``` javascript
const dftNum = new IPA(100);
const dftStr = new IPA('--');
```

The `.check` method returns `false` when the data/property has different type from the default value, similar to the **type** strategy.

``` javascript
dftNum.check(''); // false
dftStr.check(0); // false
```

The `.guarantee` method returns the default value when invalid. This is **different** from the **type** strategy.

``` javascript
dtfNum.guarantee(true); // 100
dftStr.guarantee(0); // '--'
```

The `.mock` method generates a random value the same type as the default value, similar to the **type** strategy, it's also based on the _generating config_.

``` javascript
dtfNum.mock(); // 12
dftStr.mock(); // 'anim'
```
**- custom**

As requirements could be various in different situations, it's hard for IPA to cover all the possible strategies. Thus IPA allows users to defined their own strategies by a function which returns an object with two keys: `.isValid` and `.value`.

``` javascript
const custom = new IPA(val => {
    const isValid = val >= 0;
    return {
        isValid,
        value: isValid ? val : -val,
    };
});
```

The `.check` method returns the value of `.isValid`.

``` javascript
custom.check(-1); // false
custom.check(1); // true
```

The `.guarantee` method returns the value of `.value` by inputting the original data to the function.

``` javascript
custom.guarantee(-15); // 15
custom.guarantee(15); // 15
```

The `.mock` method returns the value of `.value` by inputting _seed_ to the function.

The _seed_ is a default input for all custom strategies, it's set to `null` by default, you may change it by `.setConfig({ seed: <yourSeed> })`

``` javascript
custom.setConfig({ seed: '' });
custom.mock(); // 0
```

> **Attention**: the custom function must be self-consistent. That means the output of the function should always be valid according to the function itself.

> For instance, the following function is not allowed because it may return an invalid value such as `-0.5`:

> `val => ({ isValid: val > 0, value: val > -1 ? val : 0 });`

> IPA won't check the validity of the custom function until the `.mock` method is run and will abort the calculation and throw an error when invalid. So be careful using it.

**- object**

Naturally use a common object structure to describe the data structure.

``` javascript
const obj = new IPA({
    name: String,
    id: Number,
    children: {
        name: String,
        id: Number,
    }
});
```

The `.check` method will recursively check the object tree, only returns `true` when the whole structure is valid.

``` javascript
obj.check({
    name: 'Jessie',
    id: 1,
    children: {
        name: 'Peter',
        id: '', // invalid
    }
}); // false
```

The `.guarantee` method will recursively guarantee the object tree, returning a valid data structure.

``` javascript
obj.guarantee({
    name: 'Jessie',
    id: 1,
    children: {
        name: 'Peter',
        id: '', // invalid
    }
}); // { name: 'Jessie', id: 1, children: { name: 'Peter', id: 0 }}
```

The `.mock` method recursively mocks along the object tree.

```javascript
obj.setConfig({ dict: ['Antonius', 'Augustus', 'Marcus', 'Caesar', 'Julius'], min: 1, max: 10 });

obj.mock(); // { name: 'Augustus', id: 3, children: { name: 'Julius', id: 7 }}
```

> The object strategy has the most obvious logic, it's the basis of the IPA class

**- array**

If you are expecting an array whose items are of various structures _(e.g. `['Peter', 23, { id: 12, children: 'Mark' }]` )_, you have to use the _custom strategy_.
However if the items of your array are of the same structure, which is a more common case, you may use the first item of the array to describe it.

``` javascript
const numArr = new IPA([Number]); // array of numbers
const strArr = new IPA(['']); // array of Strings
const objArr = new IPA([Object]); // array of objects
```

The `.check` method only returns `true` if all the items of the array is valid, **or when the array is empty**.
``` javascript
numArr.check([14, 30, '12']); // false
strArr.check(['Tomi', '']); // true
objArr.check([{ id: 1 }, { name: 'Peter' }]); // true

numArr.check([]); // true
strArr.check([]); // true
objArr.check([]); // true
```

The `.guarantee` method recursively guarantees all the items of the array. If the target is not an array, it simply returns `[]`.
``` javascript
numArr.guarantee({}); // []
strArr.guarantee(['Tomi', 12, '']); // ['Tomi', '', '']
objArr.guarantee([{ id: 1 }, 0]); // [{ id: 1 }, {}]
```

The `mock` method mocks a valid-structure array of a random length.

``` javascript
numArr.mock(); // [1, 3, 5, 10, 4, 7, 12, 4, 1, 5]
```

>The length randomize method is separated from that of `Number`. You may config it using `.setConfig({ minLen: <minimum length>}, maxLen: <maxinum length>)`. The minimum and maxinum lengths are set to 2 and 20 by default.

**- array length**

One powerful function of IPA.js is its length-relationship management. The **array Length** strategy is actually a substrategy of the **array strategy**. We here discuss it separately so that you won't feel confused about it.

Use the second item of the _array template_ to describe the length information of an array. You may use a number to specify a certain length, or use a string to describe an equality relationship. If you don't have any demand on the item structure of the array, you may use either `null` or `undefined` as a placeholder, `null` does **not** represent **required** here.

``` javascript
const fixNumArr = new IPA([Number, 4]); // a number array of fix length four
const fixArr = new IPA([null, 10]); // no item-structure demand
const paraXY = new IPA({
    x: [Number, 'l'],
    y: [Number, 'l'],
}); // an object with two same-length number arrays as properties
const square = new IPA([[Number, 'size'], 'size']); // a square matrix
const cube = new IPA([[[Number, 'size'], 'size'], 'size']); // a cube
const doubleRelated = new IPA({
    x: [String, 'len'],
    series: [{
        name: String,
        data: [Number, 'len']
    }, 'legends'],
    legend: [String, 'legends']
}); // meaning .x.length === .series[].data.length && .series.length === .legend.length
```

The `.check` method returns `true` when all the structure demands and length demands meet.

``` javascript
fixArr.check([1, 'asd', {}, 10]); // true
paraXY.check({
    x: [1,2,3],
    y: [2,3],
}); // false
```

The `.guarantee` method fix the lengths according to the _length strategy_. The `.pop` method is called if the length requires diminution. If the length requires enlargement the `.guarantee` method is recursively called on it's new items.

> The _length strategy_ defines the processing method when the lengths unmatch. There're 4 optional strategies:
> - **most(default)**: match the lengths to the most high-frequency length
> - **shortest**: match the lengths to the shortest length
> - **longest**: match the lengths to the longest length
> - **average**: match the lengths to the average length
> you may use `.setConfig({ strategy: <strategy> })` to set the length matching strategy.

``` javascript
paraXY.setConfig({ strategy: 'shortest' });
paraXY.guarantee({
    x: [1, 2, 3],
    y: [1, 2, 3, 4]
}); // { x: [1, 2, 3], y: [1, 2, 3] }
```

The `.mock` receives a _setting object_ input and returns a valid data according to the _setting object_. The _length object_ has length-describing strings as keys and the corresponding length as values:

``` javascript
doubleRelated.mock({ len: 5, legends: 2 });
// {
//     x: ['ad', 'cillum', 'qui', 'ut', 'magna'],
//     series: [{
//         name: 'sunt',
//         data: [2, 13, 8, 5, 1],
//     }, {
//         name: 'laborum',
//         data: [17, 5, 6, 12, 10],
//     }],
//     legends: ['proident', 'sint']
// }

cube.mock({ size: 2 });
// [ [ [ 16, 0 ], [ 1, 8 ] ], [ [ 7, 16 ], [ 13, 18 ] ] ]
```

**- summary**

The following table shows a summary of all the strategies of the _**template object**_.

 name | template | check  | guarantee  | mock  
--|---|---|---|---
_required_  |  `null` | invalid when undefined | return **seed**  | return **seed**
_type_ |   JSON-allowed constructors\* | invalid when wrong type | return common value when valid | return random valid value    
_default_ |  JSON-allowed value** | invalid when wrong type  | return default when invalid  | return value with valid type    
 _custom_ | `val => ({ isValid, value })` |judge by `.isValid` | return `.value` when invalid  | return `.value` by inputting **seed**
_object_  |  `{ keys:subtemplates }` | valid when object && keys all valid | return `{}` when not object && recursively guarantee its keys | return `{}` and recursively mock its keys  
_array_ |  `[ subtemplate, length ]` | valid when array && all items valid && length matches | return `[]` when not array && guarantee its items && fix the length by **strategy** | return `[]` && recursively mock its items && match its length by **strategy**

\* `Number`, `String`, `Boolean`, `Array`, `Object`.

\** other than `null`, `{}`, `[]`.


### methods

So far we've talked about all of the strategies available in _**template object**_ and cover most of the logic within the major methods: `check`, `guarantee` and `mock`.

The following discusses a little details of the methods respectively.

**- check**

The `.check` method is a strict checking method which returns `true` when the incoming data is valid and `false` when not. It does not modify the original data. `.check` is better used when you have the most strict demand on your data structure and tolerate no slight misstakes.

**- guarantee**

By default, the `.guarantee` method does **not** modify the original data. Instead, it creates a deep copy of the original data and validify the copy. By setting the second parameter of the input to `false`, you're able to validify on the original data _(if it's an object)_:

``` javascript
const ipa = new IPA({
    num: 12,
});

data = {
    num: '12'
};

data === ipa.guarantee(data); // false
data === ipa.guarantee(data, false); // true
```

However, this is strongly **not** recommended because it break the one-way data flow and may cause confusions in future maintaining, especially when you're using IPA between modules.

**- mock**

Mocking is designed to be a developping tool not a production function. It helps you to speed up generating mocking data, however if you use `.mock` methods a lot when developping, you may very likely forget to replace them with the actual production method _(e.g. ajax etc.)_ . A better way to use it when you got a bunch of APIs to mock is to use a central mocking module, even establishing a mocking server to generate data so that your production can be separated from the developing environment.
<!-- We'll take a further look into this in **'IPA in Component-structure projects'**. -->

**- setConfig**

`.setConfig` is used as `.setConfig({ <config_key>:<config_value> })`. The following enumerates all the configable keys and their default values:

- **dict**: a list of Latin words
- **max**: `20`
- **maxLen**: `20`
- **min**: `0`
- **minLen**: `20`
- **seed:**: `null`
- **strategy**: `'most'`

If you want to set any _<config_key>_ _(expect for `seed`)_ back to the default value, just set the corresponding _<config_value>_ to be `'default'`.
``` javascript
ipaInstance.setConfig({ dict: 'default' }); // set the dict back to default
```

**- resetConfig**

This resets all your config keys back to their default values, including `seed`.

**- getConfig**

`.getConfig` returns you the certain _config\_value_ according to the _config_key_ you provide. If nothing _(or `null`)_ is provided, it returns you the whole config object.

Do notice that the value returned is always a deep copy of the origin value.

<!-- ## IPA in Component-structure projects
guarantee tree -->

## MECHANISM

### Flyweight
Flyweight meaning very light instances. If you take a look, you'll find IPA instances are actually quite light objects. Only none-default configs, template objects and interfaces of `.check`, `.guarantee`, `.mock`, `.setConfig`, `.resetConfig` and `.getConfig`. Everything that's not specified for a single instance is put somewhere else so that the object can be as light as possible.

This enables you to create lots of instances by only consume a little space.


### Singleton
The single-thread property of javascript makes it possible for all the instances of IPA to depute a single core to do all the calculations. While calculation, the core, a singleton, is initiated by the instance and is injected through the calculation so that any part of the core is accessable to the whole core.

### Strategy
All `.check`, `.guarantee` and `.mock` methods are generated by one single recursion method. The recursion method only generates those three methods once to initiate the singleton core. The recursion collections a bunch of strategies and switch between them when doing the calculatings.

### Demostration
It may be abstract to describe the mechanism by words, the following is a demo image showing how the IPA works inside:

<img src="https://github.com/pierrejacques/IPA.js/blob/master/img/mechanism.jpg"/>
