import { IPAErrorLog, IPAErrorCatcher } from "../interface";

class IPAErrorMap extends Map<string, Object> {
    constructor(logStack: Array<IPAErrorLog>) {
        super();
    }
}

class Catcher implements IPAErrorCatcher {
    private stack: Array<IPAErrorLog>;

    constructor() {}

    log(errorLog) {
        this.stack.unshift(errorLog);
    }

    clear(): void {
        this.stack = [];
    }

    display(): IPAErrorMap {
        return new IPAErrorMap(this.stack);
    }
}

export default new Catcher();
