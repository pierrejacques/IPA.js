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
_IPA.js in 10 minutes!_

### installation
- install with npm
``` shell
$ npm install --save-dev ipa.js
```

- import in <script> tags by 'src'
``` html
<script type="text/javascript" src="#/ipa.min.js" ></script>
```

### IPA instances & template object
IPA.js provides an _IPA class_ to realize its functions. Its instances are created using _template object_.

``` javascript
import IPA from 'ipa.js' // import the IPA class

const template = { // create a template object
    x: [Number, 'l'],
    y: [String, 'l'],
};

const ipa = new IPA(template); // create an IPA instance
```

The _template object_ describes the structure of the data. The template above described a data structure that:
1.  should be a plain object who has properties named _**x**_ and _**y**_.
1.  Both _**x**_ and _**y**_ are arrays.
1.  _**x**_ contains numbers while _**y**_ contains strings.
1.  _**x**_ and _**y**_ should have same lengths, which is quite common in data-visualization scenerios.

``` javascript
import IPA from 'ipa.js'

const ipa = new Ipa({
    propertyRequired: null,
    propertyNumber: Number,
    propertyDefaultString: '',
    propertyCustom: (val) => {
        isValid = true;
        if (!val) {
            return { value: 0, isValid: false }
        }
        return { value: val, isValid: true }
    },
    propertyArray: [{
        name: String,
        id: Number,
    }],
});
```

The IPA template usually has a same structure with the incoming data, see *TEMPLATE OBJECT* to learn more advanced usage.

## METHODS
Ipa instances have the following simply and useful methods:

- check(data): check the incoming data, and return whether the data is isValid
- guarantee(data): check the incoming data, and return a guaranteed valid data according to the template
- mock(config): mock random valid data according to the template


## TEMPLATE OBJECTS

1. usual checking and defaulting
2. length checking for arrays
3. checking unknown name properties for dicts
4. mocking config


## APPLY IPA FOR E2E DEV
