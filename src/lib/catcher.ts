import { IPAErrorLog, IPAErrorCatcher, IPAErrorLogType } from "../interface";

class IPAErrorMap {
    log: Array<IPAErrorLog>;
    constructor(logStack: Array<IPAErrorLog>) {
        this.log = logStack;
    }
}

class Catcher implements IPAErrorCatcher {
    private stack: Array<IPAErrorLog> = [];

    constructor() {}

    key(keyName) {
        this.stack.unshift({
            type: IPAErrorLogType.Key,
            value: keyName,
        });
    }

    log(msg) {
        this.stack.unshift({
            type: IPAErrorLogType.Message,
            value: msg,
        });
    }

    clear(): void {
        this.stack = [];
    }

    display(): IPAErrorMap {
        return new IPAErrorMap(this.stack);
    }
}

export default new Catcher();
