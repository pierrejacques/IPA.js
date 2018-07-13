import { IPAErrorLog, IPAErrorDict } from '../interface';

function match(key: string, deepKey: string): boolean {
    const result = key.indexOf(deepKey);
    const len = deepKey.length;

    return key === deepKey || (
        result === 0 &&
        /[.\[]/.test(key[len])
    );
}
export default class IPAError implements IPAErrorLog {
    constructor(
        public method: string,
        public exceptions: IPAErrorDict,
        public input: any
    ) {}
    
    has(deepKey) {
        return Object.keys(this.exceptions).some(key => match(key, `input${deepKey}`));
    }
}
