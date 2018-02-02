# IPA.js
your interface butler

```
                 _____                      _____ _____                 _____ _____                              
                /\    \                    /::::::\    \               /::::::\    \                
               /::\    \                  /::::::::\    \             /::::::::\    \              
              /:::/    /                 /:::/--\:::\    \           /:::/--\:::\    \              
             /:::/    /                 /:::/   _\:::\    \         /:::/   _\:::\    \                  
            /:::/____/                 /:::/   /  |:::|    |       /:::/   /  \:::\    \              
           /::::\    \                /:::/   /   |:::| __ |      /:::/   /   /::::\    \          
          /::::::\    \              /:::/   /   /:::/    /      /:::/   /   /::::::\    \            
         /:::/\:::\    \            /:::/___/   /:::/    /       |:::|   |  /:::/\:::\    \          
         \::/  \:::\    \           \:::\   \  /:::/    /        |:::|   | /:::/  \:::\____\             
          \/___/\:::\    \ ____      \:::\   \/:::/    /         \:::\   \/:::/    \::/    /        
                 \:::\    /\    \     \:::\  /:::/    /           \:::\  /:::/    / \/____/         
                  \:::\  /::\ ___\     \:::\/:::/    /             \:::\/:::/    /              
                   \:::\/:::/    /      \::::::/    /               \::::::/    /              
                    \::::::/    /        \::::/____/                 \::::/____/              
                     \::::/    /          \:::\    \                  \:::\    \              
                     /:::/    /            \:::\    \                  \:::\    \              
                    /:::/    /              \:::\    \                  \:::\    \              
                   /:::/    /                \:::\____\                  \:::\____\                  
                   \::/    /                  \::/    /                   \::/    /              
                    \/____/                    \/____/                     \/____/              

```

IPA, the name of a type of fragrant ale beer, is an API interface manager. 

With simply three major methods, it improves your dev efficiency, helps making code easier maintaining and most importantly, makes sure your apps running steadily by checking the received data from other applications or servers.

## GET STARTED
_if you're familiar with javascript and npm, you can be an expert IPA user in 10 minutes!_
### installation
- install with npm
``` shell
$ npm install --save-dev ipa.js
```

- import in <script> tags by 'src'
``` html
  <script src="#/ipa.min.js" lang="javascript"></script>
```

### use in projects
- IPA class and instances
IPA.js provides a class named _IPA_ to realize its functions. Import it in and create instance using a _template object_.

For example, the following code create an IPA instance that ensures:
1. The data is an object who has properties named _**x**_ and _**y**_
1. Both _**x**_ and _**y**_ are arrays while _**x**_ contains numbers and _**y**_ contains strings
1. _**x**_ and _**y**_ should have same lengths, which is quite common in data-visualization scenerios

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
