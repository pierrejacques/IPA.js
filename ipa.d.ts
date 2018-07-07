declare class IPA implements IPALike {
    static isProductionEnv: boolean;
    static $compile(template: any): IPACore;
    static install(mvvm: Object | Function): void;
    static inject(name: any, template: any): void;
    static getInstance(name: any): IPALike;

    static asClass(constructor: Function, ...params: Array<any>): IPACustomFunction;
    static assemble(checkTemplate: any, guaranteeTemplate: any, mockTemplate: any): IPACustomFunction;
    static Dict(subTemplate: any): IPACustomFunction;
    static Each(subTemplate: Array<any>, isStrictLength?: boolean): IPACustomFunction;
    static From(...params: Array<any>): IPACustomFunction;
    static Integer: IPACustomFunction;
    static Range(min: number, max: number, isFloat?: boolean): IPACustomFunction;
    static or(...params: Array<any>): IPA;

    constructor(template: any);
    
    check(data?: any): boolean;
    guarantee(data?: any, isDeep?: boolean, isStrict?: boolean): any;
    mock(config?: IPAMockConfig, isProdEnv?: boolean): any;
    strategy: IPAStrategy;
}

interface IPALike {
    check(data?: any): boolean;
    guarantee(data?: any, isDeep?: boolean, isStrict?: boolean): any;
    mock(config?: IPAMockConfig, isProdEnv?: boolean): any;
    strategy: IPAStrategy;
}

interface IPACore {
    check(data?: any): boolean;
    guarantee(data?: any, isStrict?: boolean): any;
    mock(isProdEnv: boolean): any;
}

interface IPAMockConfig {
    [key: string]: number;
}

declare enum IPAStrategy {
    Shortest = 'shortest',
    Longest = 'longest',
    Most = 'most',
    Average = 'average',
    Least = 'least'
}

interface IPACustomFunction {
    (compiler: Function): IPACore; 
}

export = IPA;
