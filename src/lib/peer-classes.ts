import { IPAStrategy, IPAMockConfig, IPACore } from "../interface";

export class IPALike {
    public core: IPACore;
    public strategy: IPAStrategy;

    check(data?: any): boolean { return true; }
    
    guarantee(data?: any, isDeep?: boolean, isStrict?: boolean): any {}

    mock(config?: IPAMockConfig, isProdEnv?: boolean): any {}
}

export class IPAProxy extends IPALike {
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
