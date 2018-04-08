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
const IPA = require('ipa.js');
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
                return !rules.filter(rule => rule.check(val) === false).length;
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

- 第二个参数为布尔型，表示当前的mock的行为是否为**生产环境行为**，默认值为`false`。在生产环境行为下，mock方法不再随机地生成数据，而是给出尽可能基本的具有合法结构的数据，其结果类似`guarantee(undefined)`的结果。这样做是为了避免开发时的mock影响到线上的真实数据，并减少上线前的代码改动量。可以通过配置`IPA.isProductionEnv`来全局地改变mock的行为，不过对于具有第二个参数输入的mock方法，还是以输入的参数为准。关于全局环境的配置以及如何在MV*工程中更合理地使用mock，详见[工程化]()

``` js
const schema = new IPA([Number]);

schema.mock(); // [2,9,4,3,6]
schema.mock({}, true); // []
```



## 三、校验规则声明语法

### 数字
- Number

用`Number`声明一个数字类型。

guarantee在数据类型不符以及mock时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |  
| --- | --- | --- | 
| guarantee | 尝试强转数字并返回，如结果为`NaN`或`Infinite`，返回`0` | 返回`0` | 
| mock | 随机生成一个`0-10`之间的整数 | 返回`0` |


``` js
const num = new IPA(Number);

num.guarantee('123'); // 123
num.guarantee('123', true, true); // 0
num.mock(); // 4 (随机值)
num.mock({}, true); // 0
```

- 数字默认值

用 _一个数字_ 声明一个具有默认值的数字类型。

在guarantee类型不符以及mock时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |  
| --- | --- | --- | 
| guarantee | 返回默认值 | 返回默认值 | 
| mock | 随机生成一个`0-10`之间的整数 | 返回默认值 |

``` js
const num = new IPA(-1);

num.guarantee('123'); // -1
num.guarantee('123', true, true); // -1
num.mock(); // 8 (随机值)
num.mock({}, true); // -1
```


### 字符串
- String

用`String`声明一个字符串类型。

guarantee在数据类型不符以及mock时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |  
| --- | --- | --- | 
| guarantee | 尝试强转字符串并返回 | 返回`''` | 
| mock | 随机生成一个字符串 | 返回`''` |


``` js
const str = new IPA(String);

str.guarantee(123); // '123'
str.guarantee(123, true, true); // ''
str.mock(); // 'ad' (随机值)
str.mock({}, true); // ''
```

- 字符串默认值

用 _一个字符串_ 声明一个具有默认值的字符串类型。

在guarantee类型不符以及mock时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |  
| --- | --- | --- | 
| guarantee | 返回默认值 | 返回默认值 | 
| mock | 随机生成一个字符串 | 返回默认值 |

``` js
const str = new IPA('--');

str.guarantee(123); // '--'
str.guarantee(123, true, true); // '--'
str.mock(); // 'ad' (随机值)
str.mock({}, true); // '--'
```

### 布尔
- Boolean

用`Boolean`声明一个布尔类型。

guarantee在数据类型不符以及mock时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |  
| --- | --- | --- | 
| guarantee | 强转布尔 | 返回`false` | 
| mock | 随机产生`true`或`false` | 返回`false` |

``` js
const bool = new IPA(Boolean);

bool.guarantee(123); // true
bool.guarantee(123, true, true); // false
bool.mock(); // true (随机值)
bool.mock({}, true); // false
```

- 布尔默认值

用 _一个布尔值_ 声明一个具有默认值的布尔类型。

在guarantee类型不符以及mock时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |  
| --- | --- | --- | 
| guarantee | 返回默认值 | 返回默认值 | 
| mock | 随机产生`true`或`false` | 返回默认值 |

``` js
const bool = new IPA(true);

bool.guarantee(123); // true
bool.guarantee(123, true, true); // true
bool.mock(); // false (随机值)
bool.mock({}, true); // true
```

### 对象
- Object

用`Object`生明一个对象类型，即PlainObject。

在guarantee方法下数据不是PlainObject时，或mock方法下，无论模式环境，一律返回一个空对象：

``` js
const obj = new IPA(Object);

obj.check([]); // false
obj.guarantee(123); // {}
obj.guarantee(123, true, true); // {}
obj.mock(); // {}
obj.mock({}, true); // {}
```

- 属性校验

用一个普通对象嵌套声明对对象属性的要求。check方法只在属性全部合法时返回`true`，guarantee和mock方法都对每个属性迭代执行校验。没有声明结构的属性将不受影响。

``` js
const obj = new IPA({ name: String, value: -1 });

obj.check({ name: 123, value: 10 }); // false
obj.guarantee({ name: 123, value: 10 }); // { name: '123', value: 10 }
obj.guarantee({ name: 123, value: 10 }, true, true); // { name: '', value: 10 }
obj.mock(); // { name: 'quot', value: 8 } (随机值)
obj.mock({}, true); // { name: '', value: -1 }
```

### 数组
- Array

用`Array`生明一个数组类型。

在guarantee方法下数据不是数组和mock方法下，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |  
| --- | --- | --- | 
| guarantee | 尝试强转数组并返回 | 返回`[]` | 
| mock | 返回`[]` | 返回`[]` |


``` js
const arr = new IPA(Array);

arr.check({}); // false
arr.guarantee(123); // ['1', '2', '3']
arr.guarantee(123, true, true); // []
arr.mock(); // []
arr.mock({}, true); // []
```

- 通项校验

通过一个数组级其**首项**声明对数组的每一项的数据要求。
check方法逐一检查输入数组的每一项（如果是数组的话），在全部合法时返回`true`。
guarantee方法在输入数据不是数组时返回`[]`，否则逐一对输入数组的每一项执行相应模式下的guarantee方法
mock方法在开发环境下生成随机长度的合法数组，在生产环境下返回空数组

``` js
const arr = new IPA([Number]);

arr.check(['1', 2]); // false
arr.guarantee(['1', 2]); // [1, 2]
arr.guarantee(['1', 2], true, true); // [0, 2]
arr.mock(); // [3, 1, 5, 8] (随机值)
arr.mock({}, true); // []
```

- 长度校验

通过一个数组的**第二项**声明对数组的长度要求。长度参数可以是一个字符串也可以是一个非负整数。后者将声明一个具有固定长度的数组校验规则，前者将表明一种长度相等的关系。长度的check、guarantee和mock都将在对数据的其他校验都执行完后进行。

``` js
const fixed = new IPA([undefined, 3]);
fixed.check(['', 1, true]); // true

const square = new IPA([[Number, 'size'], 'size']);
square.check([[1, 2], [3, 4], [5, 6]]); // false
```

在面对具有同一个长度参数的数组的长度不一致时，guarantee方法将根据当前实例的策略来进行合法化。IPA支持如下的四种策略：

1. shortest（默认）: 取具有同一长度参数的最短的数组的长度作为目标长度
1. longest：取具有同一长度参数的最长的数组的长度作为目标长度
1. average：取具有统一长度参数的平均长度（向上取整）作为目标长度
1. most：取具有统一长度参数的长度众数作为目标长度

对长度不足的数组，对数组通项的guarantee方法输入`undefined`来获得合法的增添项。

``` js
const tbody = new IPA([[Number, 'cols'], 'rows']);
const data = [
    [1, 2, 3],
    [1, 2, 3],
    [1, 2],
    [1, 2, 3, 4]
];

tbody.strategy = 'shortest'; // 默认值
tbody.guarantee(data); // [[1, 2], [1, 2], [1, 2], [1, 2]]
tbody.strategy = 'longest';
tbody.guarantee(data); // [[1, 2, 3, 0], [1, 2, 3, 0], [1, 2, 0, 0], [1, 2, 3, 4]]
tbody.strategy = 'average';
tbody.guarantee(data); // [[1, 2, 3], [1, 2, 3], [1, 2, 0], [1, 2, 3]]
tbody.strategy = 'most';
tbody.guarantee(data); // [[1, 2, 3], [1, 2, 3], [1, 2, 0], [1, 2, 3]]
```

mock方法优先根据输入的setting对象来对长度参数进行赋值，对未赋值的长度参数，在开发环境下进行随机赋值，在生产环境下赋为`0`。然后逐一根据通项的规则mock每一项。需要注意的是在使用IPA嵌套语法时，被嵌套的实例的长度参数也会污染到当前实例中，在使用中需要格外注意。

``` js
const table = new IPA({
    thead: [String, 'cols'],
    tbody, // tbody中的长度参数cols和rows也会在当前实例起作用
});

table.mock({ cols: 2, rows: 3 });
//  {
//      thead: ['et', 'ad'],
//      tbody: [[5, 2], [7, 1], [3, 4]],
//  }

table.mock({}, true);  //  { thead: [], body: [] }
```

### 旁通规则

- null

通过声明`null`来要求数据不能是`undefined`。在guarantee遇到`undefined`的时候返回`null`。mock直接返回`null`。

``` js
const required = new IPA(null);

required.check(undefined); // false
required.guarantee(undefined); // null
required.mock(); // null
```

- undefined

通过声明`undefined`获得一个真正意义上的旁通规则*bypass*，规则如下：

``` js
const bypass = {
    check: () => true,
    guarantee: v => v,
    mock: () => undefined,
};
```

### 实例嵌套
IPA允许在规则声明中嵌套使用IPA实例，其本质与直接正常的声明语法没有区别。即：

``` js
const sub = new IPA([Number, 'cols']);
const schema = new IPA([sub, 'rows]);
```

与

``` js
const sub = new IPA([Number, 'cols']);
const schema = new IPA([[Number, 'cols'], 'rows']);
```

在结果上几乎没有区别。但在过程却有所不同，前者对`[Number, 'cols']`的声明只进行了一次编译，从而更快，并占用更小的内存。因而在需要复用一部分声明时，还是建议使用前者的做法。

需要注意的是在使用IPA嵌套语法时，被嵌套的实例的长度参数也会污染到当前实例中，在使用中需要格外注意，例子见[数组-长度校验]()。

### 自定义校验

- 规则函数

为了方便理解自定义规则的写法，这里首先要介绍一下IPA嵌套规则校验的实现细节。

在IPA中，所有的**规则声明语法**最终都会被转换成具有统一结构的**规则函数**，然后通过传入一个**编译函数（compile）**作为回调函数，通过闭包嵌套，得到一个可以直接执行check、guarantee和mock方法的**规则对象**。最后为其封装一层实例层面的接口来实现对这三个方法的间接访问。

下面的伪代码以一个简化了的数组通项校验的**规则函数**为例，说明规则函数的结构和编译细节，其中template为规则声明：

``` js
function arraySimple (compile) { // 传入编译函数
    // 编译阶段执行的代码，通常用于递归编译子模板，形成闭包
    const subRule = compile(template[0]); // 取首项作为子声明，并编译成规则对象
    // 返回具有check，guarantee和mock方法的规则对象
    return {
        check(data) { // 参数：输入数据
            // check的实现
            return isArray(data) && !data.filter(i => !subRule.check(i)).length;
        },
        guarantee(data, strict) { // 参数一：输入数据；参数二：是否严格模式
            // guarantee的实现
            const arr = isArray(val) ? data : [];
            arr.forEach(i => subRule.guarantee(i, strict));
            return arr;
        },
        mock(prod) { // 参数：是否是生产环境
            // mock的实现
            return [];
        },
    };
}
```

- 自定义规则函数

自定义规则只需遵循上述**规则函数**的结构，提供到**规则声明**中即可。如下示例了一个约定的HTTP响应数据的基本结构，以及针对不同响应类型的扩展结构：

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

不过自定义规则允许更为宽松的语法，不强制要求**规则函数**返回所有的三种方法，对没有返回的方法，IPA会自动为它增添`undefined`声明下的[旁通规则]()：

比如下面自定义的**与规则**，只定义了`check`方法的执行规则：

``` js
function and (...templates) {
    return (compile) => {
        const rules = templates.map(template => compile(template));
        return {
            check(val) {
                return !rules.filter(rule => rule.check(val) === false).length;
            } 
        }
    }
}；
```


## 四、扩展规则

为了适应更多的数据校验场景，IPA还内建了一些扩展规则。本质上，这是一系列由IPA本身提供的自定义方法，可通过`IPA[<方法名>]`来获得。

- 整型：Integer

整型的校验规则与`Number`非常相似

在它的guarantee方法在的输入数据不是整型，和调用mock方法时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |  
| --- | --- | --- | 
| guarantee | 尝试强转整数并返回 | 返回`0` | 
| mock | 随机生成一个`0-10`之间的整数 | 返回`0` |


``` js
const { Integer } = IPA;
const int = new IPA(Integer);

num.guarantee('123.4'); // 123
num.guarantee(123.4, true, true); // 0
num.mock(); // 4 (随机值)
num.mock({}, true); // 0
```

- 数值范围：Range

Range函数用来生成一个数字范围的校验规则。它接受三个参数：`Range(min:number, max:number [, isFloat:boolean = false ]);`
前两个参数min和max分别用来界定范围的最小和最大值（范围为闭区间），第三个参数isFloat用来改变mock行为，控制它是否生成浮点数，但它**不影响**check和guarantee的行为。

在它的guarantee方法在的输入数据不在范围中时，和调用mock方法时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |  
| --- | --- | --- | 
| guarantee | 非数字先转数字，过小返回`min`，过大返回`max` | 非数字先转`0`，过小返回`min`，过大返回`max` | 
| mock | 根据`isFloat`随机生成一个范围内的整数或浮点数 | 返回`min` |

``` js
const { Range } = IPA;
const range = new IPA(Range(100, 110));

range.check(90); // false
range.check(105.5); // true
range.guarantee('105'); // 105
range.guarantee('105', true, true); // 100
range.mock(); // 107 (随机值)
range.mock({}, true); // 100

const percentage = new IPA(Range(0, 1, true));
percentage.mock(); // 0.13 (随机值)

percentage.mock({}, true); // 0
```


- 枚举：From

当要求数据必须来自一个特定的有限的集合时，采用From规则。From规则接受任意多个参数组成集合。只要被校验的数据与集合中的某一值相等（对于对象，采用深度比较，只要两个对象的每个属性都一致即认为相等），check方法就返回`true`。

在它的guarantee方法在的输入数据不与集合中的任何项目相同时，以及调用mock方法时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |  
| --- | --- | --- | 
| guarantee | 返回集合任意值的深拷贝 | 返回集合内首个声明的值 | 
| mock | 返回集合任意值的深拷贝 | 返回集合内首个声明的值 |

``` js
const codes = new Set([{
    label: 'OK',
    value: 200,
}, {
    label: 'Not Modified',
    value: 300,
}, {
    label: 'Client Error',
    value: 400,
}, {
    label: 'Server Error',
    value: 500,
}]);

const { From } = IPA;
const codeSchema = new IPA(From(...codes));
codeSchema.check({ label: 'OK', value: 200 }); // true
codeSchema.guarantee(null); // { label: 'Client Error', value: 300 } （随机值）
codeSchema.guarantee(null, true, true); // { label: 'OK', value: 200 } （首项）
codeSchema.mock(null); // { label: 'Server Error', value: 500 } （随机值）
codeSchema.mock({}, true); // { label: 'OK', value: 200 } （首项）
```

- 字典：Dict
    
Dict函数声明一种类似Python中Dict的概念的对象，要求改对象的每个值具有特定的数据结构。它的输入参数即用于声明这种结构：
check方法只在所有属性合法时返回`true`，guarantee方法遍历所有存在的属性，mock方法在开发环境下返回一个具有随机属性名和属性个数的合法对象，在生产环境下返回一个空对象。

``` js
const { Dict } = IPA;
const strDict = new IPA(Dict(String));

strDict.check({ a: 'a', b: 'b' }); // true
strDict.guarantee({ b: 123, c: 'c' }); // { b: '123', c: 'c' }
strDict.guarantee({ b: 123, c: 'c' }, true, true); // { b: '', c: 'c' }
strDict.mock(); // { 'cillum': 'quis', 'et': 'magna'}（随机值）
strDict.mock({}, true); // {}
```

- 数组逐项：Each

数组逐项规则逐项校验一个数组的每一项，用于数组的每项的数据类型不一致的情况下。它接受两个输入参数：`Each(template:array [, strictLength:boolean = true])`。第一个参数为数组的逐项规则声明，第二个参数为一个布尔值，表明是否对数组的长度进行严格要求，默认值为`true`。

``` js
const { Each } = IPA;
const each = new IPA(Each([Number, String]));
const firsts = new IPA(Each([Number, String], false));

each.check([1, '1']); // true
each.check([1, '1', 2]); // false
firsts.check([1, '1', 2]); // true
each.guarantee(['1', 1, 2]); // [1, '1']
firsts.guarantee(['1', 1, 2]); // ['1', 1, 2]
each.guarantee(['1', 1, 2], true, true); // [0, '']
firsts.guarantee(['1', 1, 2], true, true); // [0, '', 2]
each.mock(); // [4, 'ad']（随机值）
each.mock({}, true); // [0, '']
```

- 或规则：or

或规则允许数据符合多条规则。check方法在符合任意一条规则时即返回`true`，guarantee和mock方法都服从输入的第一条规则。

``` js
const { or } = IPA;
const numOrStr = new IPA(or(Number, String));

numOrStr.check(1); // true
numOrStr.check('a'); // true
numOrStr.guarantee(null); // 0
numOrStr.mock(); // 7（随机值）
```

- 类校验：asClass

类校验用于标示把输入的函数当成一个类来进行校验。第一个参数为类构造函数，后面的参数为默认输入到这个构造函数的参数。在guarantee输入数据不是该类的实例或mock时，一律返回由默认值构造的实例。

```
class Person {
    constructor(fn, ln) {
        this.fn = fn;
        this.ln = ln;
    }
}

const { asClass } = IPA;
const p1 = new Person('John', 'Doe');
const p2 = { fn: 'Pierre', ln: 'Jacques' };

const personSchema = new IPA(asClass(Person, 'John', 'Doe'));
personSchema.check(p1); // true
personSchema.check(p2); // false
personSchema.guarantee(p2); // Person{fn:'John',ln:'Doe'}
personSchema.mock(); // Person{fn:'John',ln:'Doe'}
```


## 五、工程化
### mock与生产环境

通过配值`IPA.isProductionEnv`来全局配置当前的运行环境。`true`表示在生产环境，`false`表示在开发环境，默认值为`false`。除非通过第二个参数进行特殊设定，工程内的所有mock默认依照`IPA.isProductionEnv`的设置来执行相应的mock行为。

``` js
const arr = new IPA([Number, 'len']);
arr.mock(); // [7, 1, 5, 8, 3]（随机值）
arr.mock({ len: 3 }); // [4, 6, 8]（给定长度）

IPA.isProductionEnv = true;

arr.mock(); // []
arr.mock({ len: 3 }); // [0, 0, 0]
```

全局生产环境的配置使得mock方法也可以在线上代码中出现，而不必在上线前删除。通过恰当地配合MV*框架来使用，甚至可以实现从开发到生产的平滑过渡，无需对包含大量mock方法的代码进行任何上线前的修改。详见[与MV*框架的配合使用]()

### 实例的全局注入与调用

通过IPA.inject方法来全局注入一个实例，第一个参数表示注入实例的键名，第二个参数为规则声明：

``` js
const { or, Integer } = IPA;
IPA.inject('id', or(Integer, String));
```

通过getInstance方法来获得一个全局实例。值得注意的是，getInstance方法不是直接返回一个已被注入了实例，而是返回一个行为与IPA实例完全一致的代理 *Proxy*，在该代理被首次调用时，才会去尝试获取该实例。这样的做法使得使用者不必担心项目模块间的初始化顺序导致无法获取未被注入实例，只需要保证首次调用的时候实例已被注入即可：

``` js
// a.js，先被执行
import IPA from 'ipa.js';
export default IPA.getInstance('numOrStr');

// b.js，后被执行
import IPA from 'ipa.js';
const { or, Integer } = IPA;
export default () => {
    IPA.inject('numOrStr', or(Integer, String))
};

// index.js, 主模块
import numOrStr from './a';
import init from './b';

init();

Ajax.get(url).then(
    res => {
        numOrStr.check(res.data); // 调用在注入之后即可
    }
);

```

IPA的一个重要的使用场景是在端对端项目中用于校验和保障来自另一端的数据。IPA的全局注入功能使得对API接口的数据保障进行集中管理成为可能。如下：

``` js
// API.js
import IPA from 'ipa.js';

IPA.inject('/api/getList', [Number]);
IPA.inject('/api/getDetail', {
    name: String,
    value: Number,
});
...

// index.js
import IPA from 'IPA';
import Ajax from 'ajax'; // 某个异步请求库

...
const url = '/api/getList';
Ajax.get(url).then(
    res => {
        this.data = IPA.getInstance(url).guarantee(res.data);
    }
)
...
```

### 与MV*框架的配合使用

IPA目前针对vue.js框架进行了工程化优化：

- mock的使用

mock主要被用在组件间属性传递和ajax请求返回中。
对于前者，若上游组件还在同步开发阶段，可以在props中使用：

``` js
...
props: {
    data: {
        default: dataSchema.mock(),
    }
}
...
```

 对于后者，若另一端接口还在开发阶段，可以在Promise的reject回调中使用：
 
 ``` js
 ...
 .then(
    res => {
        this.data = dataSchema.guarantee(res.data); // 或用check
        // 其他操作
    },
    err => {
        this.data = dataSchema.mock();
        // 其他报错处理
    }
 );
 ...
 ```
 
 对以上两种用法，均可以直接通过`IPA.isProductionEnv = true`的全局设置实现无改动上线。
 

- 全局注入语法糖

通过`Vue.use(IPA)`可以将IPA的`getInstance`方法全局挂载到vue实例下的`$ipa`属性上，从而简化全局调用的语法。

``` js
// API.js
IPA.inject('schema', template);

// App.vue
...
this.$ipa('schema').check
...
```
