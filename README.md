# IPA.js

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

## IPA是什么

IPA是API的镜像，不过起这个名字很大程度上也源于对印度艾尔啤酒的热爱（IPA，Indian Pale Ale）。

IPA通俗地说是一个接口数据结构验证器，但远不止仅仅的校验，因而称之为管理器。

它可以验证和保障深层的对象结构：

<img src="https://github.com/pierrejacques/IPA.js/blob/master/img/deep-object.jpg" width="800" style="margin: auto" />

也可以验证对内部数组的长度关系有要求的数据结构（这类需求在用于可视化的数据中常见）：

<img src="https://github.com/pierrejacques/IPA.js/blob/master/img/arr-length.jpg" width="850" style="margin: auto" />

依照对合法结构的认识，IPA可以自己生成mock数据，一方面方便开发，一方面也可以作为随机发生器：

<img src="https://github.com/pierrejacques/IPA.js/blob/master/img/mocking.jpg" width="700" style="margin: auto" />

## 为什么需要IPA

在开发/维护一个端对端的项目或是一个具有复杂模块层级的大型应用时，往往无法保证流入一个模块/组件/端的数据结构总是合法的。对于较为复杂的数据结构，手动校验每个层次和类型往往费事、易错且会大大降低代码的可阅读性。因而很多时候人们干脆略过这道检查转而选择信任上游模块/组件，这显然是很危险的。对于一些对输入数据要求严格的可视化数据尤为如此，可能会导致系统直接报错。

除了上述问题，常规的js模块代码对传来的数据结构和类型往往没有显式的声明，这会提高后来的维护者理解和维护的成本和犯错的概率。

IPA.js通过提供check，guarantee，mock三种方法来帮助解决上述问题。而用于创建IPA实例的 _模板对象（template object）_ 显式地声明了传入的数据的结构类型，帮助开发者和未来维护者无需阅读上游模块的代码就能掌握数据结构的全部信息。

## 开始使用

### 安装

IPA.js专为node工程设计，通过命令行用npm安装它：

``` shell
$ npm install --save-dev ipa.js
```

在你的模块中引入它：

``` javascript
import IPA from 'ipa.js'
```

### 概览
IPA.js通过提供一个IPA类来实现它的功能，通过一个描述数据结构的 _模板对象（template object）_ 来实例化这个类。

``` javascript
import IPA from 'ipa.js' // 引入IPA类

const weekDataTemplate = { // 创建一个模板对象
    x: [Number, 'l'],
    y: [String, 'l'],
};

const weekDataIpa = new IPA(weekDataTemplate); // 实例化
```

每个实例拥有 _check_, _guarantee_ 和 _mock_ 三个方法:

- **check**: check方法验证传入数据的合法性:

``` javascript
weekDataIpa.check({
    x: [0.1, 0.15, 0.07],
    y: ['Mon', 'Tue', 'Wed'],
}); // true

weekDataIpa.check({
    x: [0.1, 0.15, 0.07],
    y: ['Mon'],
}); // false (长度不匹配)
```

- **guarantee**: guarantee方法保障传入的数据，并永远返回一个经过最小改动的合法数据结构:

``` javascript
// 下行代码把长度策略配置为最短策略 'shortest' (不必须)
weekDataIpa.setConfig({ strategy: 'shortest' });

const incomingData = {
    x: [0.1, 0.15, 0.07],
    y: ['Mon', 'Tue'],
};

weekDataIpa.guarantee(); // {"x":[0.1,0.15],"y":["Mon","Tue"]}
```

- **mock**: mock方法可以根据模板对象生成合法的mocking数据:

``` javascript
// 自定义字典 (不必须)
weekDataIpa.setConfig({ dict: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] });

weekDataIpa.mock() // {"x":[2,5,3,5,15,17],"y":["Thu","Tue","Tue","Thu","Fri","Wed"]}

// 把‘l’所指代的长度固定为2
weekDataIpa.mock({ l: 2 }); // {"x":[8,17],"y":["Fri","Mon"]}
```

实例的行为可以通过 _setConfig_ 和 _getConfig_ 方法来配置.

### 模板对象 _（template object）_
模板对象是掌握IPA用法的核心，它用于描述一个数据应有的结构，例如下面的模板：

``` javascript
{
    x: [Number, 'l'],
    y: [String, 'l'],
}
```
描述了符合如下几条规则的数据结构:

-  数据应该是一个常规对象，它应有名为 _**x**_ 和 _**y**_ 的两个属性.
-  属性 _**x**_ 和 _**y**_ 都是数组.
-  _**x**_ 是一个数字数组， _**y**_ 是一个字符串数组.
-  _**x**_ 和 _**y**_ 应该总是具有相等的长度，这个长度用`'l'`标记.

由于IPA本意是为了验证JSON数据结构设计的，它目前对无法表示称JSON格式的数据类型的支持欠佳 _(例如 Symbol, Set, Map, RegExp 等.)_. 下面介绍模板对象的基本写法，这些x写法被分为几类，每类称为一个策略：

**- 必填策略（required）**

用 `null` 来表述一个必填的数据/字段.

``` javascript
const singleRequired = new IPA(null); // data
const propertyRequired = new IPA({ x: null }); // property
```

`.check`方法在数据/字段缺失 _（或等于undefined）_ 时返回`false`:

``` javascript
singleRequired.check(null); // true
singleRequired.check(undefined); // false

propertyRequired.check({}); // false
propertyRequired.check({ x: null }); // true
propertyRequired.check({ x: undefined }); // false
```

`.guarantee`方法在数据/字段缺失时返回 _种子(seed)_ ，`.mock`也方法直接返回 _种子(seed)_ :

> _种子(seed)_ 应用在 **必填策略** 和 **自定义策略** 中，他的默认值是`null`。可以通过 `.setConfig({ seed: <种子值> })`配置实例的种子值。

``` javascript
singleRequired.guarantee(); // null
singleRequired.mock(); // null

propertyRequired.guarantee({ x: undefined }); // { x: null }
propertyRequired.mock(); // { x: null }
```

**- 类型策略（type）**

用一个JSON合法的构造器来描述一个数据/字段的合法类型，具体来说就是`Number`, `String`, `Boolean`, `Object`和`Array`。

``` javascript
const num = new IPA(Number);
const str = new IPA(String);
const bool = new IPA(Boolean);
const obj = new IPA(Object);
const arr = new IPA(Array);
```

`.check`方法在数据/字段的类型不符的时候返回`false`。

``` javascript
num.check(''); // false
str.check({}); // false
bool.check(1); // false
obj.check([]); // false
arr.check({}); // false
```

`.guarantee`方法在数据/字段类型不符时返回一个常见的合法类型值，如下：

``` javascript
num.guarantee(null); // 0
str.guarantee(null); // ''
bool.guarantee(null); // false
obj.guarantee([]); // {}
arr.guarantee({}); // []
```

`.mock`方法基于 _生成配置项_ 返回一个随机的合法值。
``` javascript
num.mock(); // 12
str.mock(); // 'ipsum'
bool.mock(); // false
obj.mock(); // {} (总是)
arr.mock(); // [] (总是)
```

> 相关的配置项如下:
> - **min** (_Number_, 默认值: 0): 生成数字的下限
> - **max** (_Number_, 默认值: 20): 生成数字的上限
> - **dict** (_Array_, 默认值: 一系列拉丁单词): 用于生成字符串的字典

你可以通过 `.setConfig` 方法配置实例的配置项：

``` javascript
num.setConfig({ min: -100, max: 100 });
num.mock(); // -23

str.setConfig( dict: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
str.mock(); // 'Wed'
```

**- 默认策略**

默认策略与类型策略非常相似，使用一个JSON合法的 **非空非对象** 的值来设定一个数据/字段的默认值。

``` javascript
const dftNum = new IPA(100);
const dftStr = new IPA('--');
```

与类型策略类似，`.check`方法在数据/字段与默认值的类型不一致时返回`false`。

``` javascript
dftNum.check(''); // false
dftStr.check(0); // false
```

`.guarantee`方法在数据/字段不合法时返回默认值。

``` javascript
dtfNum.guarantee(true); // 100
dftStr.guarantee(0); // '--'
```

与类型策略类似，`.mock`方法基于 _生成配置项_ 返回一个随机的合法值。

``` javascript
dtfNum.mock(); // 12
dftStr.mock(); // 'anim'
```
**- 自定于策略**

由于实际应用中的需求多样性，IPA难以覆盖到所有的验证策略。故IPA允许用户通过一个函数自定义策略。该函数必须返回一个带有`.isValid`和`.value`的对象。

``` javascript
const custom = new IPA(val => {
    const isValid = val >= 0;
    return {
        isValid,
        value: isValid ? val : -val,
    };
});
```

`.check`方法返回自定义函数执行结果的`.isValid`字段.

``` javascript
custom.check(-1); // false
custom.check(1); // true
```

`.guarantee`返回自定义函数执行结果的`.value`字段.

``` javascript
custom.guarantee(-15); // 15
custom.guarantee(15); // 15
```

`.mock`以 _种子_ 作为自定义函数的输入，返回结果`.value`字段。

``` javascript
custom.setConfig({ seed: '' });
custom.mock(); // 0
```

>**注意**: 自定义函数必须具有自洽性，即所有它的返回的值对它自身而言应该是合法的。

>如下是一个非法的自定义函数的例子因为它的返回值集超过的了他的有效值集，例如它可能返回`-0.5`，但对它自身而言这是一个非法值。

>`val => ({ isValid: val > 0, value: val > -1 ? val : 0 });`

>出于效率需要，IPA不会在实例化时验证自定义函数的合法性。在`.mock`方法的运行中，IPA会对自定义函数生成的每个值进行自洽性验证，如果出现上述矛盾情况则会终端运算并报错，故请务必小心使用。

**- 对象策略**

对象策略直接通过对象层级结构来描述数据应有的对象层级结构。

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

`.check`方法会递归整个对象树，只有全部结构都合法时才返回`true`。

``` javascript
obj.check({
    name: 'Jessie',
    id: 1,
    children: {
        name: 'Peter',
        id: '', // 应为数字
    }
}); // false
```

`.guarantee`方法会递归整个对象树，执行每个字段对应的策略来返回一个合法化的数据结构。

``` javascript
obj.guarantee({
    name: 'Jessie',
    id: 1,
    children: {
        name: 'Peter',
        id: '', // 应为数字
    }
}); // { name: 'Jessie', id: 1, children: { name: 'Peter', id: 0 }}
```

`.mock`方法会递归生成一个具有合法结构的mocking数据。

```javascript
obj.setConfig({ dict: ['Antonius', 'Augustus', 'Marcus', 'Caesar', 'Julius'], min: 1, max: 10 });

obj.mock(); // { name: 'Augustus', id: 3, children: { name: 'Julius', id: 7 }}
```

> 对象策略是IPA的策略中最为自然易懂的，他也是IPA基础策略

**- 数组策略**

如果需要验证一个每一项都具有不同结构类型的数组，你必须使用自定义策略来实现。一个更普遍的情况是，你希望一个数组的每一项都具有相同结构的要求，这就可以通过数组策略实现了。

数组策略用一个数组的 **首项（index = 0）** 来描述它每一项的结构。

``` javascript
const numArr = new IPA([Number]); // 数字数组
const strArr = new IPA(['']); // 字符串数组
const objArr = new IPA([Object]); // 对象数组
```

`.check`方法只在数组的所有项都合法或 **数组为空数组** 时返回`true`。

``` javascript
numArr.check([14, 30, '12']); // false
strArr.check(['Tomi', '']); // true
objArr.check([{ id: 1 }, { name: 'Peter' }]); // true

numArr.check([]); // true
strArr.check([]); // true
objArr.check([]); // true
```

`.guarantee`方法对数组的每一项进行保障。如果数据/字段不是一个数组，则直接返回一个空数组。

``` javascript
numArr.guarantee({}); // []
strArr.guarantee(['Tomi', 12, '']); // ['Tomi', '', '']
objArr.guarantee([{ id: 1 }, 0]); // [{ id: 1 }, {}]
```

`mock`方法生成一个具有随机长度的合法数组。

``` javascript
numArr.mock(); // [1, 3, 5, 10, 4, 7, 12, 4, 1, 5]
```

>数组的长度生成方法与数组的随机生成方法是分离的。你可以通过`.setConfig({ minLen: <最小长度>}, maxLen: <最大长度>)`来配置。最小长度和最大长度的默认值为2和20。

**- 数组长度策略**

IPA的一个亮点在于它的长度管理机制。数组长度策略本质上是数组策略的一部分。在此我们单独把它拿出来讨论，以避免产生理解上的混乱。

用模板对象中数组的 **第二项（index = 1）** 来描述对数组的长度要求。你可以通过一个具体的数值指定一个固定的长度，亦可以通过一个字符串代表的变量名来描述数据中数组间的长度关系。如果你只关心一个数组的长度而是对其每一项的数据结构没有要求的化，可以用`null`或`undefined`作为占位符。此处的`null`不再具有‘必填’的含义。

``` javascript
const fixNumArr = new IPA([Number, 4]); // 一个长度为4的数字数组
const fixArr = new IPA([null, 10]); // 一个长度为10的数组
const paraXY = new IPA({
    x: [Number, 'l'],
    y: [Number, 'l'],
}); // 一个具有两个等长的数组作为属性的对象
const square = new IPA([[Number, 'size'], 'size']); // 一个以size为边长的数字方阵
const cube = new IPA([[[Number, 'size'], 'size'], 'size']); // 一个以size为边长的数字立方
const doubleRelated = new IPA({
    x: [String, 'len'],
    series: [{
        name: String,
        data: [Number, 'len']
    }, 'legends'],
    legend: [String, 'legends']
}); // 双重长度要求，即.x.length === .series[].data.length && .series.length === .legend.length
```

`.check`方法只在所有的数据结构要求和长度要求满足时返回`true`。

``` javascript
fixArr.check([1, 'asd', {}, 10]); // true
paraXY.check({
    x: [1,2,3],
    y: [2,3],
}); // false
```

`.guarantee`依照 _长度策略_ 来修正长度不匹配的数组长度。数组的长度总是从尾部减小和增大。如果一个数组的长度需要加长，则按照guarantee方法进行递归修正。

> _长度策略_ 决定了长度不匹配时的修正策略d。共有如下4种不同的策略:
> - **most(默认)**: 匹配至出现频率最高的长度
> - **shortest**: 匹配至出现的最短的数组长度
> - **longest**: 匹配至出现的最长的数组长度
> - **average**: 匹配至出现的长度的平均长
> 你可以通过`.setConfig({ strategy: <长度策略> })` 来配置长度策略。

``` javascript
paraXY.setConfig({ strategy: 'shortest' });
paraXY.guarantee({
    x: [1, 2, 3],
    y: [1, 2, 3, 4]
}); // { x: [1, 2, 3], y: [1, 2, 3] }
```

`.mock`方法接收一个 _赋值对象_ 并依此返回一个合法数据。_赋值对象_ 通过键值对的形式给 _模板对象_ 中的长度变量赋值。

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

**- 模板对象小结**

下表列出了模板对象中的所有策略：

 策略 | 模板写法 | check  | guarantee  | mock  
--|---|---|---|---
必填  |  `null` | `undefined`时非法 | 返回**种子** | 返回**种子**
类型 |   JSON合法构造器\* | 类型不符时非法 | 非法时返回常规合法值 | 返回随机合法值
默认 |  JSON合法值\** | 类型不符时非法 | 非法时返回默认值 | 返回同类型的随机值  
自定义 | `val => ({ isValid, value })` |通过`.isValid`判断 | 返回`.value` | 返回输入 **种子** 的得到的`.value`
对象  |  `{ keys: 子模板 }` | 迭代全部合法时合法 | 非对象时返回`{}`，迭代修正 | 返回迭代生成的合法数据  
数组 |  `[ 子模板, 长度 ]` | 所有项合法时合法 | 非数组时返回`[]`，遍历修正每一项并依照**长度策略**修正长度 | 依照**赋值对象**决定长度并遍历生成每一项

\* `Number`, `String`, `Boolean`, `Array`, `Object`.

\** 除了`null`, `{}`, `[]`.


### 方法

到目前对峙我们介绍了所有 _**模板对象**_ 中的策略，并覆盖到了大部分方法的行为逻辑。接下来进一步分别介绍IPA实例上的方法的一些细节。

**- check**

`.check` 方法是一个严格检验方法。它对不污染输入数据本身。`.check`适用于对数据结构要求最为严格并对结构类型错误零容忍的情况。

**- guarantee**

在默认情况下，`.guarantee` 方法**不**污染输入数据. 相反, 它会先创建一个深拷贝的副本，然后对副本执行修正运算。通过把输入的第二个参数设为`false`可以实现在输入数据上修正  _(当输入是一个对象时)_:

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

然而这种做法会破坏数据流的单向性从而造成污染上游数据和复杂化代码逻辑的风险故在此不推荐这种做法，更合理的做法是通过一层缓冲来保障数据，例如在Vue项目中：

``` javascript
// in Vue 
{   
    ...,
    props: ['data'],
    computed: {
        securedData() {
            return ipa.guarantee(this.data);
        },
    },
    ...
}
```

**- mock**

`.mock`方法设计的初衷是用于方便开发。开发阶段的mock解决方案有很多。GraphQL赋予了客户端按需直接查询字段的能力；对于传统架构的请求而言，现有的一些解决策略可以通过webpack重定向到一个mock服务器实现对异步调试的模拟同时避免从开发阶段转到联调阶段的过程中修改代码。不过用于mock的JSON数据大都仍是手写，IPA的生成功能可以与上述方案结合，形成从定接口到联调的一整套解决方案。

<!-- We'll take a further look into this in **'IPA in Component-structure projects'**. -->

**- setConfig**

`.setConfig`方法用于为实例设定配置项。其基本的使用格式为：`.setConfig({ <config_key>:<config_value> })`。下面列出了所有可配置项的名称和默认值。

- **dict**: a list of Latin words
- **max**: `20`
- **maxLen**: `20`
- **min**: `0`
- **minLen**: `20`
- **seed:**: `null`
- **strategy**: `'most'`

如果你想把一个配置项的值恢复到默认值，只需输入`'default'`即可。

``` javascript
ipaInstance.setConfig({ dict: 'default' }); // 把字典设为默认
```

> 种子seed是一个例外，你无法通过输入`'default'`重置它，因为它会把`'default'`当作一个新的seed值。事实上除了使用`.resetConfig`方法，你没有办法把一个已被设定过的种子恢复到默认值。纵然你可以显式地把它的值设为与默认值相同，其内部的逻辑还是有所区别————当你查看该实例的`.__config__`属性，你会发现`.seed`仍作为一个特殊配置值位列其中。

**- resetConfig**

该方法把该实例的所有配置项归为默认值（包括seed）。其实现的原理很简单，即清空保存一个实例的特殊配置的`.__config__`对象。

**- getConfig**

`.getConfig`把接收一个配置项的名称并返回该配置项的值，无论它是否是默认配置。如果名称缺省（或为`undefined`）则返回整个配置对象，包括默认值。 

值得注意的是，返回的所有对象都是深拷贝，你不能通过改变其中的字段来改变实例的配置项。

<!-- ## IPA 大型项目中的树状数据保障 -->
<!-- ## IPA-server -->

## 运行机制

### 享元
把IPA的实例打印出来你会发现它本身非常轻小，只保存了特殊的配置项，模板对象和各个方法的接口（这些实际上保存在原型上）。所有的不独有的特性都被分离开来，保存在一个单例上以轻量化实例。

### 单例
Javascript单线程的运行方式使得把全部的运算委托给一个函数成为可能。IPA**类**创建时（注意，不是实例），由迭代核产生的基本迭代方法（check-recursion, guarantee-recursion和mock-recursion）会被加入运算模块（asset）中，成为一个单例。而这个单例又会被以循环引用的方式注入上述的基本迭代方法中。每次运算前，ipa实例会配置运算模块（称为asset），设定使用什么方法和配置进行运算，然后迭代核会通过组织一系列的策略来实现功能。

### 策略
所有的模板对象策略与实例和类接耦独立维护，只接受迭代函数的调配。每个策略由一个条件（condition）和三个基本方法组成。asset对象会被注入到策略的方法中，令每一个策略都有实现全局的方法调用和缓存读写的权限。

### 示意图
下面是IPA的内部工作原理的一个示意图。

<img src="https://github.com/pierrejacques/IPA.js/blob/master/img/mechanism.jpg"/>
