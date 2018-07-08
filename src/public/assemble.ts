export default (c, g, m) => (compile) => {
    const check = compile(c).check;
    const guarantee = compile(g).guarantee;
    const mock = compile(m).mock;
    return {
        check,
        guarantee,
        mock,
    };
};