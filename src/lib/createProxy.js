import _core_ from './symbol';

const getterProps = ['check', 'guarantee', 'mock', _core_];
const bothProps = ['strategy'];

export default (getInstance) => {
    const proxy = {};
    getterProps.forEach(prop => {
        Object.defineProperty(proxy, prop, {
            get() {
                return getInstance()[prop];
            }
        });
    });
    bothProps.forEach(prop => {
        Object.defineProperty(proxy, prop, {
            set() {
                return getInstance()[prop];
            },
            get() {
                return getInstance()[prop];
            }
        });
    });
    return proxy;
};



