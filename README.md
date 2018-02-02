# IPA.js -- your interface manager

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

IPA, name of an ale, is an API interface manager. With simply three major methods, it improves your dev efficiency, helps making code easier maintaining and most importantly, makes sure your apps running steadily by checking the received data from other applications or servers.

## GET STARTED
IPA.js is both easy to install and get started.
An IPA instance is initialized with a template object

``` javascript
import Ipa from 'Ipa'

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