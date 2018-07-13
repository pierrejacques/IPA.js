export enum IPAStrategy {
    Shortest = 'shortest',
    Longest = 'longest',
    Most = 'most',
    Average = 'average',
    Least = 'least'
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
export interface IPAErrorCatcher {
    hasLog: boolean;
    logMap: IPAErrorDict;
    currentKey: string;
    clear(): void;
    push(key: any): void;
    pop(): void;
    wrap(key: any, getResult: () => any): any;
    catch(msg: string, result?: boolean): boolean;
    log(key: string, msg: string): void;
    free(callback: () => any): any;
}

export interface IPAErrorDict {
    [key: string]: string;
}

export interface IPAErrorLog {
    exceptions: IPAErrorDict;
    method: string;
    input: any;
    has(deepKey: string): boolean;
}

export interface IPACache {
    push(name: string, item: any): void;
    set(name: string, value: any): void;
    get(name): any;
    forEach(item?: any, index?: number): any;
    reset(): void;
    digest(Object): void;
}

export interface IPAErrorSubscriber {
    (log: IPAErrorLog): void;
}