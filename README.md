# IPA.js

**fantastic ale beer**

**fantastic API data manager**

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

## GET STARTED

### what IPA does
IPA.js is an interface data manager. It helps you to check and guarantee your incoming data structure, and generate valid data when developing.

IPA.js can deal with deep object structures:

<img src="https://github.com/pierrejacques/IPA.js/blob/master/img/deep-object.png" width="700"/>

as well as length-demanded array structures which is common in data visualization cases:

![array-length secure](https://github.com/pierrejacques/IPA.js/blob/master/img/arr-length.png)

it can even generate data for you following the valid structure:

![mocking valid data](https://github.com/pierrejacques/IPA.js/blob/master/img/mocking.png)

### why IPA.js
If you're working on an e2e project or a large-scale application which contains a lot of data flows between modules(e.g Components in MV* frameworks), you can't always be sure that the incoming data of a module/end is of a valid structure. Hand checking the data structure is often tedious, messy and risk-taking. Thus skipping this checking is what people usually do, which may seriously threaten the robustness of your application. Besides, the later maintainers have to check a bunch of files until having an idea on the data structure flowing into a single module.

IPA helps to solve the problems above by managing the data structure with **check, guarantee** and **mock** methods. The descriptive object(named as _template object_) helps to explicitly state the incoming data so that the current developpers and future maintainers can quick get an idea on how the data look like.

### installation

install with npm
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

Every instance have three major methods:  _check_, _guarantee_ and _mock_:
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
// this configs the length strategy to be shortest (unnecessary)
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

The behaviour of the instance can be set and get using methods _setConfig_ and _showConfig_.

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

Initially designed for JSON data checking, IPA currently does **not** support data types that can't be present with JSON well _(e.g Symbol, Set, Map, RegExp etc.)_. The following introduces the six basic strategies for _template object_.

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

The `.check` method returns `wrong` when the data/property has wrong type.

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

The related config keys are:
- **min** (_Number_, default: 0): the lower bound of `Number` type
- **max** (_Number_, default: 20): the upper bound of `Number` type
- **dict** (_Array_, default: a group of Latin words): the dictionary from which the `String` type mocks its value.

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

The `.check` method returns `wrong` when the data/property has the different type from the default value, which works similar to the **type** strategy.
``` javascript
dftNum.check(''); // false
dftStr.check(0); // false
```

The

**- object**


**- array**

\* `null` in array

**- custom**



### check

### guarantee

### mock

### setConfig

### summary

The following table shows a summary of all the syntax of the _**template object**_.

 name | template | check  | guarantee  | mock  
--|---|---|---|---
_required_  |  `null` | invalid when undefined | mock when invalid  | return null   
_type_ |   JSON-allowed constructors\* | invalid when wrong type | mock when invalid | return random valid value    
_default_ |  JSON-allowed value** | invalid when wrong type  | return default when invalid  | return value with valid type    
 _custom_ | `val => ({ isValid, value })` |judge by `.isValid` | return `.value` when invalid  | return `.value` by inputting **seed**
_object_  |  `{ keys:subtemplates }` | valid when object && keys all valid | return {} when not object && recursively guarantee its keys | return {} and recursively mock its keys  
_array_ |  `[ subtemplate, param ]` | valid when array && all items valid && length matches | return [] when not array && guarantee its items && fix the length by **strategy** | return [] && recursively mock its items && match its length by **strategy**

\* Number, String, Boolean, Array, Object

\** other than null, {}, []


## IPA in Component-structure projects

## mechanism & performance

### flyweight instances with singleton asset

### strategies
