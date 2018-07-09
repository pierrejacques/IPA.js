export default (Cls, ...params) => {
    return () => ({
        check: v => v instanceof Cls,
        guarantee: v => (v instanceof Cls ? v : new Cls(...params)),
        mock: () => new Cls(...params),
    });
};
