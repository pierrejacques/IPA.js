const fixLength = ({ itemTemplate, targetLength, array, mocker }) => {
    if (array.length > targetLength) {
        array.splice(targetLength);
    } else {
        const times = targetLength - array.length;
        for (let i = 0; i < times; i++) {
            array.push(mocker(itemTemplate, null));
        }
    }
};

const strategies = {
    most(val) {
        const lengths = val.map(item => item.length);
        const freq = new Map();
        lengths.forEach(length => {
            if (freq.get(length) === undefined) {
                freq.set(length, 0);
            }
            freq.set(length, freq.get(length) + 1);
        });
        const sorted = [...freq].sort((a, b) => a[1] < b[1]).map(item => item[0]);
        return sorted[0];
    },
    shortest(val) {
        return Math.min(...val.map(item => item.length));
    },
    longest(val) {
        return Math.max(...val.map(item => item.length));
    },
    average(val) {
        const lengths = val.map(item => item.length)
        const average = lengths.reduce((val, item, index) => {
            return (val * index + item) / (index + 1);
        });
        return Math.ceil(average);
    },
};

const fixArray = (asset, strategy) => {
    const cache = asset.cache;
    Object.keys(cache).forEach(para => {
        const item = asset.cache[para]
        const targetLength = strategies[strategy](item);
        item.forEach(obj => {
            fixLength({
                itemTemplate: obj.itemTemplate,
                targetLength,
                array: obj.array,
                mocker: asset.recursions.guarantee,
            });
        });
    });
};

export {
    fixLength,
    fixArray,
}
