import { IPAErrorLog, IPAErrorDict } from '../interface';

export default class IPAError implements IPAErrorLog {

    constructor(public method: string, public exceptions: IPAErrorDict, public input: any) {}
    
    has(deepKey) {
        // TODO: 对exceptions的搜索逻辑
        return true;
    }
}