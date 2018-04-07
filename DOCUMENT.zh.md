# IPA.js文档（v3.1.0）

## 一、快速入门
### 安装与引用

IPA.js是一个数据结构校验库，可以同时运行于浏览器端和node环境。

通过npm命令行的方式来安装它：

``` bash
npm i ipa.js -D
```

或通过yarn

``` bash
yarn add ipa.js
```

在项目中通过ES6 import语法或是require语法引用它：

``` js
import IPA from 'ipa.js';
```

或

``` js
var IPA = require('ipa.js');
```

### 作用与基本用法

IPA.js的核心功能围绕数据校验展开，它通过一种类似Mongoose.Schema的语法来声明对数据结构的要求并创建实例：

``` js
const personSchema = new IPA({
    name: String,
    age: Number,
    girlfriends: [String],
});
```

通过**check**，**guarantee**，**mock**三种方法来分别实现对数据的深层**校验**，**保障**和**自动生成**：

- check方法校验数据结构的合法性：

``` js
personSchema.check({
    name: '李雷',
    age: 13,
    girlfriends: ['韩梅梅', '钟梅梅', '李梅梅'],
    location: '上海',
}); // true
```

- guarantee方法保障数据的合法性，给予系统一定的容错能力：：

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

- mock方法生成随机的合法数据，方便开发：

``` js
personSchema.mock();

// { 
//     name: 'magna',
//     age: 13,
//     girlfriends: ['ipsum', 'ad', 'veniam']
// }
```

IPA还对**数组长度**提供了强大的校验、保障和生成机制。
如下校验一个表格数据，要求其表头和每一行的列数一致：

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

通过上述核心功能，IPA能为开发带来诸多好处：

- 完成繁琐易漏的数据结构校验
- 帮助增强模块的容错能力
- 增强代码的可读性
- 提升端对端/多模块开发效率

### 扩展规则

为了方便在多种场景下实现对复杂数据结构的校验，IPA提供了一系列易用的内置类型校验和默认值校验，并且支持实例间的相互嵌套：

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

### 自定义规则

IPA还支持具有高扩展性的规则自定义，并支持构造自定义的嵌套规则。

如下示例了一个可以对校验规则进行 _**与操作**_ 的函数，并基于此生成了一个可以用来校验是否是合法的ASCII码值的校验器：

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

如下示例了一个自定义的HTTP响应数据的基本结构，以及针对不同响应类型的扩展结构：

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
const dataSchema2 = new IPA(Res([{
    name: String,
    value: Number
}]));
```

### 工程化

由于使用场景多是大型的端对端多模块工程，IPA提供了如**全局注入**和**开发环境设置**等功能来贴合工程化开发场景中的需求，更多IPA的语法细节和工程化用法请见[工程化]()



## 二、校验方法

### check方法
check方法用于对数据结构的瑕疵零容忍的场景。它接受一个待检验的数据作为参数，并返回一个布尔值作为校验结果：

``` js
const arrSchema = new IPA([String]);

arrSchema.check(['a', 'b', 'c']); // true
arrSchema.check({ 0: 'a', 1: 'b', 3: 'c', length: 3 }); // false
```

### guarantee方法
guarantee方法顾名思义，用来合法化一个合法性未知的数据。鉴于此，它不仅可以用于提高系统的容错率，也可以用来生成一个空的合法结构：

guarantee方法可以接受3个输入参数：`guarantee(data:any [,deepCopy:boolean = true [,strictMode:boolean = false]])`

- 它的第一个参数接受需要被保障的数据：

``` js
const formSchema = new IPA({
    username: String,
    password: String,
    repeat: String,
});

formSchema.guarantee({
    username: 'John Doe',
    password: 123,
    repeat: '123',
});
//  {
//      username: 'John Doe',
//      password: '123',
//      repeat: '123',
//  }

formSchema.guarantee(null);
//  {
//      username: '',
//      password: '',
//      repeat: '',
// }
```

- 第二个参数为布尔型，表示是否需要对原数据进行深拷贝，考虑到一般需要保护数据流的单向性，其默认值为`true`：

``` js
const schema = new IPA({ prop: String });

const obj = { prop: 123 };
schema.guarantee(obj) === obj; // false
schema.guarantee(obj, false) === obj; // true
```

- 第三个参数为布尔型，表示是否需要启用**严格模式**进行数据保障，默认值为`false`。在一般模式下，guarantee倾向于对类型错误的数据进行类型转化，在严格模式下则会一律使用一个合法的默认值来替换。转换规则和默认值的取值详见[校验语法]()

``` js
const schema = new IPA(Number);

schema.guarantee('123'); // 123
schema.guarantee('123', true, true); // 0
```

### mock方法

mock方法能随机生成需要的数据，方便开发。它接受两个参数，都为非必填：`mock([setting:object = {} [, prod:boolean = false]])`

- 第一个参数为一个对象，用于在mock含数组长度要求的内容时指定长度：

``` js
const schema = new IPA([Number, 'len']);

// 不指定时，len的值将在1-10间随机生成
schema.mock(); //  [4, 2, 7, 10, 5, 2] 

// 指定len的值为3
schema.mock({ len: 3 }); // [6, 8, 1]
```
你甚至可以利用这项功能生成特定边长的数据立方、超立方等。

- 第二个参数为布尔型，表示当前的mock的行为是否为**线上环境行为**，默认值为`false`。在线上环境行为下，mock方法不再随机地生成数据，而是给出尽可能基本的具有合法结构的数据，其结果类似`guarantee(undefined)`的结果。这样做是为了避免开发时的mock影响到线上的真实数据，并减少上线前的代码改动量。可以通过配置`IPA.isProductionEnv`来全局地改变mock的行为，不过对于具有第二个参数输入的mock方法，还是以输入的参数为准。关于全局环境的配置以及如何在MV*工程中更合理地使用mock，详见[工程化]()

``` js
const schema = new IPA([Number]);

schema.mock(); // [2,9,4,3,6]
schema.mock({}, true); // []
```



## 三、校验语法

### 数字
- Number
用`Number`声明一个数字类型。

guarantee在数据类型不符时，将按如下规则返回：

| 一般模式 | 严格模式 |  
| --- | --- | 
| 尝试强转数字并返回，如结果为`NaN`或`Infinite`，返回`0` | 返回`0` | 

mock规则如下：

| 开发环境 | 线上环境 |
| --- | --- |
| 随机生成一个`0-10`之间的整数 | 返回`0` |

``` js
const num = new IPA(Number);

num.guarantee('123'); // 123
num.guarantee('123', true, true); // 0
num.mock(); // 4 (随机值)
num.mock({}, true); // 0
```

- 默认值
用一个数字声明一个具有默认值的数字类型。

在guarantee类型不符以及mock线上环境时，一律返回默认值。在mock开发环境下，行为同`Number`

``` js
const num = new IPA(-1);

num.guarantee('123'); // -1
num.guarantee('123', true, true); // -1
num.mock(); // 8 (随机值)
num.mock({}, true); // -1
```


### 字符串
- String

- 默认值


### 布尔
- Boolean

- 默认值


### 对象
- Object

- 通项校验

- 长度校验

### 自定义校验
- IPA校验的实现细节

- 自定义规则


### 规则嵌套

### undefined与null




## 四、扩展规则
- 整型：Integer

- 数值范围：Range

- 枚举：From

- 字典：Dict

- 数组逐项：Each

- 或规则：or

- 类校验：asClass


## 五、工程化
### mock与生产环境

### 实例的全局注入与调用

### 与MV*框架的配合使用


