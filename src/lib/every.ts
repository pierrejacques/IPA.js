// full checked every method

export default (arr: Array<any>, handler: (item: any, index: number) => boolean ) =>
    arr.map(handler).every(v => v);
