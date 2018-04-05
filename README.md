# IPA.js数据校验库*v3.1.0*

- 更快开发
- 更易维护
- 更鲁棒


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

## 什么是IPA.js

IPA.js是一个数据结构校验库，可以同时运行于浏览器端和node环境

它通过一种类似Mongoose.Schema的简单易懂语法来声明对数据结构的要求：

``` javascript
const personSchema = new IPA({
    name: String,
    age: Number,
    girlfriends: [String],
});

```

并通过**check**，**guarantee**，**mock**三种方法来分别实现对数据的深层**校验**，**保障**和**自动生成**：

- check方法校验数据结构的合法性：

``` javascript
personSchema.check({
    name: '李雷',
    age: 13,
    girlfriends: ['韩梅梅', '钟梅梅', '李梅梅'],
    location: '上海',
}); // true
```

- guarantee方法保障数据的合法性：

``` javascript
personSchema.guarantee({
    name: '李雷',
    age: '13',
    girlfiends: null,
    location: '上海',
});

// { 
//     name: '李雷',
//     age: 13,
//     girlfriends: [],
//     location: '上海',
// }
```

- mock方法生成随机的合法数据：

``` javascript
personSchema.mock();

// { 
//     name: 'magna',
//     age: 13,
//     girlfriends: ['ipsum', 'ad', 'veniam']
// }
```

除了对象深层校验，IPA还对数组提供了强大的长度校验、保障和生成机制：

``` javascript
const tableSchema = new IPA({
    thead: [String, 'cols'],
    tbody: [[Number, 'cols'], 'rows'],
});

const table = {
    thead: ['列1', '列2'],
    tbody: [[3, 10], [2, 4, 6], [8, 9]],
}

tableSchema.check(table); // false

tableSchema.guaratee(table);
// {
//     thead: ['列1', '列2'],
//     tbody: [[3, 10], [2, 4], [8, 9]],
// }

tableSchema.mock({ cols: 3, rows: 2 }); // 指定生成的长度
// {
//     thead: ['irure', 'mollit', 'aute'],
//     tbody: [[6, 1, 7], [2, 9, 4]],
// }
```

通过上述核心功能，IPA在完成繁琐易漏的数据结构校验的同时，帮助增强模块的容错能力，并提高开发效率。使得端对端/多模块的工程在开发层面和稳定性层面同时解耦。

为了方便在多种场景下实现对复杂数据结构的校验，IPA还提供了一系列易用的内置类型校验和默认值校验：

例如：

``` javascript
const { or, Range, Integer } = IPA;

const dataSchema = new IPA([{
    id: or(String, Number),
    value: 0,
    count: Integer,
    type: Range(1, 4),
}]);
```

它还支持具有高扩展性的规则自定义：

``` javascript
const sequenceSchema = new IPA(() => ({
    check(v) { return v.length !== undefined },
    guarantee(v) { return this.check(v) ? v : '' },
    mock() {
        const rand = () => String.fromCharCode(Math.floor(Math.random() * 26 + 65));
        return Array.apply(null, { length: 10 }).map(() => rand()).join('');
    }
}));
```

此外，IPA提供了如**全局注入**和**开发环境设置**等功能来贴合工程化开发场景中的需求，更多IPA的语法细节和工程化用法请见[IPA详细文档]()

