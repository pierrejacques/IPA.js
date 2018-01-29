import loremIpsum from 'lorem-ipsum';

export default {
    getBool() {
        return !Math.floor(Math.random() * 2);
    },
    getNum() {
        return Math.floor(Math.random() * 20);
    },
    getStr() {
        return loremIpsum({
            count: 1,
            units: 'words'
        });
    },
};
