const IPA = require('../dist/ipa.min.js');

// 先来个玩耍性质的
const cube = new IPA(
    [[[Number, 'size'],'size'],'size']
);

cube.check();
cube.mock({
    size: 3 // 一个随机魔方
});

// 实际生产中的数据
const lineChart = new IPA({
    xAxis: [String, 'dataLen'],
    legend: [String, 'indexNum'],
    series: [
        {
            name: String,
            data: [Number, 'dataLen'],
        },
        'indexNum'
    ],
});

lineChart.check(data);
lineChart.guarantee(data);
lineChart.mock({
    dataLen: 20,
    indexNum: 4,
});

// 实际生产中的数据
const table = new IPA([{
    thead: [
        {
            name: String,
            type: String,
            dataType(val) {
                return {
                    value,
                    isValid
                }
            },
        },
        'cols',
    ],
    tbody: [
        [
            null,
            'cols',
        ],
        'rows'
    ]
}, 'tableNum']);

table.check();
table.guarantee();
table.mock({
    cols: 3,
    rows: 20,
    tableNum: 5,
});

// 实际生产中的数据预处理
const series = new IPA([
    val => {
        let value = val, isValid = true;
        if (val !== undefined && val !== null && val !== '') {
            value = '--';
            isValid = false;
        }
        return { value, isValid };
    },
    'dataLen'
]);

table.check();
table.guarantee(data);
table.mock()
