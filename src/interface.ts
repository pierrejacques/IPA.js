export enum IPAStrategy {
    Shortest = 'shortest',
    Longest = 'longest',
    Most = 'most',
    Average = 'average',
    Least = 'least'
}

export interface IPALike {
    check(data?: any): boolean;
    guarantee(data?: any, isDeep?: boolean, isStrict?: boolean): any;
    mock(config?: IPAMockConfig, isProdEnv?: boolean): any;
    strategy: IPAStrategy;
}

export interface IPACore {
    check(data?: any): boolean;
    guarantee(data?: any, isStrict?: boolean): any;
    mock(isProdEnv: boolean): any;
}

export interface IPAMockConfig {
    [key: string]: number;
}

export interface IPAFunction {
    (context?: IPAContext): IPACore;
}

export interface IPACompiler {
    condition(template: any): boolean;
    execute(template: any): IPAFunction;
}

export interface IPACompileFunction {
    (template: any): IPACore;
}

export interface IPAContext {
    compile: IPACompileFunction;
    cache: IPACache;
    catcher: IPAErrorCatcher;
}

export enum IPAErrorLogType {
    Key = 'key',
    Message = 'message',
}

export interface IPAErrorLog {
    type: IPAErrorLogType;
    message: string;
}

export interface IPAErrorCatcher {
    log(errorLog: IPAErrorLog): void;
    clear(): void;
    display(): Map<string, Object>;
}

export interface IPACache {
    push(name: string, item: any): void;
    set(name: string, value: any): void;
    get(name): any;
    forEach(item?: any, index?: number): any;
    reset(): void;
    digest(Object): void;
}
