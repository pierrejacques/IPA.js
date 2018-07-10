import IPALike from './ipa-like';

class IPAProxy extends IPALike {
    constructor(private getInstance: () => IPALike) {
        super();
    }

    get core() {
        return this.getInstance().core;
    }

    get strategy() {
        return this.getInstance().strategy;
    }

    set strategy(v) {
        this.getInstance().strategy = v;
    }

    check(...params) {
        return this.getInstance().check(...params);
    }

    guarantee(...params) {
        return this.getInstance().guarantee(...params);
    }

    mock(...params) {
        return this.getInstance().mock(...params);
    }
}

export default (getInstance: () => IPALike): IPALike => {
    return new IPAProxy(getInstance);
};
