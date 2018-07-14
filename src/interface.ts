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
    currentKey: string;
    clear(): void;
    push(key: any): void;
    pop(): void;
    wrap(key: any, getResult: () => any): any;
    catch(msg: string, result?: boolean): boolean;
    log(key: string, msg: string): void;
    free(callback: () => any): any;
    getError(method: string, input: any): IPAErrorLog;
}

export interface IPAExceptions {
    [key: string]: string;
}

export interface IPAErrorLog {
    exceptions: IPAExceptions;
    method: string;
    input: any;
    has(deepKey: string): boolean;
}

export interface IPAErrorSubscriber {
    (log: IPAErrorLog): void;
}

export interface IPACache {
    cache: Map<any, any>;
    has(key: any): boolean;
    delete(key: any): boolean;
    clear(): boolean;
    set(key: any, value: any): boolean;
    get(key: any): any;
}
