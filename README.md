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

``` js
const personSchema = new IPA({
    name: String,
    age: Number,
    girlfriends: [String],
});

```

并通过**check**，**guarantee**，**mock**三种方法来分别实现对数据的深层**校验**，**保障**和**自动生成**：

- check方法校验数据结构的合法性：

``` js
personSchema.check({
    name: '李雷',
    age: 13,
    girlfriends: ['韩梅梅', '钟梅梅', '李梅梅'],
    location: '上海',
}); // true
```

- guarantee方法保障数据的合法性：

``` js
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

``` js
personSchema.mock();

// { 
//     name: 'magna',
//     age: 13,
//     girlfriends: ['ipsum', 'ad', 'veniam']
// }
```

除了对象深层校验，IPA还对数组提供了强大的长度校验、保障和生成机制：

``` js
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

为了方便在多种场景下实现对复杂数据结构的校验，IPA还提供了一系列易用的内置类型校验和默认值校验，并且支持实例间的相互嵌套：

例如：

``` js
const { or, Range, Integer } = IPA;

const unitSchema = new IPA({
    id: or(String, Number),
    value: 0,
    count: Integer,
    type: Range(1, 4),
});

const listSchema = new IPA([
    unitSchema,
]);
```

IPA还支持具有高扩展性的规则自定义。在模板编译阶段，它将解析模板语法的`compile`函数作为参数传入用户自定义的校验函数，获得返回的验证规则，这使得构造自定义的嵌套规则成为可能。

如下示例了一个可以对校验规则进行**与操作**的函数，并基于此生成了一个可以用来校验是否是合法的ASCII码值的校验器：

``` js
function and (...templates) {
    return (compile) => {
        const rules = templates.map(template => compile(template));
        return {
            check(val) {
                return rules.filter(rule => rule.check(val) === false).length === 0;
            } 
        }
    }
}；

function RangeInt (min, max) {
    return and(IPA.Range(min, max), IPA.Integer);
}

const ASCIICodeSchema = new IPA(RangeInt(0, 127));
```

如下示例了一个标准的HTTP响应数据的基本结构，以及针对不同响应类型的扩展结构：

``` js
const Res = (subtemplate = Object) => {
    return (compile) => {
        return compile({
            code: Number,
            msg: String,
            data: subtemplate,
        });
    };
};

const dataSchema1 = new IPA(Res(String));
const dataSchema2 = new IPA(Res({
    name: String,
    value: Number,
}));
```

此外，IPA提供了如**全局注入**和**开发环境设置**等功能来贴合工程化开发场景中的需求，更多IPA的语法细节和工程化用法请见[IPA详细文档]()

