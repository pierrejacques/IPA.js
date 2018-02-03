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

### why IPA.js?
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
IPA.js provides an _**IPA class**_ to realize its functions. Its instances are created using _**template object**_ which describes the structure of the incoming data.

``` javascript
import IPA from 'ipa.js' // import class IPA

const weekDataTemplate = { // create a template object
    x: [Number, 'l'],
    y: [String, 'l'],
};

const weekDataIpa = new IPA(weekDataTemplate); // create an IPA instance
```

Every instance provides three methods:
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

### template object
The _**template object**_ describes the structure of the data.

For example, the template object `{ x: [Number, 'l'], y: [String, 'l'] }` described a data structure that:

-  should be a plain object who has properties named _**x**_ and _**y**_.
-  Both _**x**_ and _**y**_ are arrays.
-  _**x**_ contains numbers while _**y**_ contains strings.
-  _**x**_ and _**y**_ should have same lengths, which is quite common in data-visualization scenerios.

To further explain how ....., JSON
#### Required
Use `null` to represent required property/data. The `.check` method returns _**false**_ when the property/data is `undefined`.

examples:
``` javascript
const singleRequired = new IPA(null);
singleRequired.check(undefined); // false;

const propertyRequired = new IPA({ x: null });
propertyRequired.check({}); // false;
```

#### Type


#### Default


#### Object


#### Array


#### Custom


### check

### guarantee

### mock

### setConfig

## IPA in Component-structure projects

## mechanism & performance

### flyweight instances with singleton asset

### strategies
