const IPA = require('../dist/ipa.js');
const { From } = IPA;

IPA.onError((err) => {
    console.log('from class:', err);
});

const basicSchema = new IPA({
    key: String,
    title: String,
});

const leafSchema = new IPA({
    valueType: From('number', 'date', 'string'),
    isLeaf: From(true),
});

const ipa = new IPA(({ catcher }) => {
    const guaranteeProvider = (val) => {
        if (!catcher.catch('an array', Array.isArray(val))) {
            return [];
        }
        val.forEach((item, idx) => {
            val[idx] = catcher.wrap(
                idx,
                () => {
                    const v = basicSchema.guarantee(item);
                    if (v.children) {
                        v.children = guaranteeProvider(v.children);
                        return v;
                    }
                    return leafSchema.guarantee(v);
                }
            );
        });
        return val;
    };
    return {
        guarantee: guaranteeProvider,
    };
}).onError((err) => {
    console.log('from instance:', err);
});

const data =  [
    {
        key: '0',
        title: '层级1',
        children: [
            {
                key: 1,
                title: '二级1',
                children: [
                    {
                        key: '$0',
                        title: '城市a他娘的特别长，能起这么长名字的城市肯定都是傻逼，真的很长',
                        valueType: 'number',
                        isLeaf: null
                    },
                    {
                        key: '$1',
                        title: '城市b',
                        valueType: 'number',
                        isLeaf: true
                    },
                    {
                        key: '$2',
                        title: '城市c',
                        valueType: 'number',
                        isLeaf: true                       
                    },
                    {
                        key: '$3',
                        title: '城市d',
                        valueType: 'number',
                        isLeaf: true                       
                    },
                    {
                        key: '$4',
                        title: '城市e',
                        valueType: 'number',
                        isLeaf: true                       
                    },
                    {
                        key: '$5',
                        title: '城市f',
                        valueType: 'number',
                        isLeaf: true                       
                    }
                ]
            },
            {
                key: '2',
                title: '二级2',
                children: [
                    {
                        key: '$2',
                        title: '城市三',
                        valueType: 'number',
                        isLeaf: true
                    },
                    {
                        key: '$3',
                        title: '城市四',
                        valueType: 'number',
                        isLeaf: true
                    },
                    {
                        key: '$a',
                        title: '城市三a',
                        valueType: 'number',
                        isLeaf: true
                    },
                    {
                        key: '$b',
                        title: '城市四a',
                        valueType: 'number',
                        isLeaf: true
                    },
                    {
                        key: '$c',
                        title: '城市三b',
                        valueType: 'number',
                        isLeaf: true
                    },
                    {
                        key: '$d',
                        title: '城市四b',
                        valueType: 'number',
                        isLeaf: true
                    }
                ]
            }
        ]
    }
];

ipa.guarantee(data);