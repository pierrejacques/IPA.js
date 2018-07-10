import { IPAStrategy, IPAMockConfig, IPACore } from "../interface";

export default class IPALike {
    public core: IPACore;
    public strategy: IPAStrategy;

    check(data?: any): boolean { return true; }
    
    guarantee(data?: any, isDeep?: boolean, isStrict?: boolean): any {}

    mock(config?: IPAMockConfig, isProdEnv?: boolean): any {}
}
