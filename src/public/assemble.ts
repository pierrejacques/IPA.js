export default (c, g, m) => ({ compile }) => {
    const cp = compile(c);
    const gp = compile(g);
    const mp = compile(m);
    return {
        check: cp.check.bind(cp),
        guarantee: gp.guarantee.bind(gp),
        mock: mp.mock.bind(mp),
    };
};
