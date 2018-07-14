// full checked AND logic

export const and = (...bools: Array<boolean>) => bools.every(i => i);

// full checked every method

export const every = (arr: Array<any>, handler: (item: any, index: number) => boolean ) =>
    arr.map(handler).every(v => v);
