export default (arr: Array<any>, handler: (item: any, index: number) => boolean ) => {
    let flag = true;
    arr.forEach((item, index) => {
        flag = flag && handler(item, index);
    });
    return flag;
};
