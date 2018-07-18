export default (Klass, ...params) => {
    const errorMsg = ` instance of ${Klass.name}`;
    return ({ catcher }) => ({
        check: v => catcher.catch(errorMsg, v instanceof Klass),
        guarantee(v) {
            return this.check(v) ? v : new Klass(...params);
        },
        mock: () => new Klass(...params),
    });
};
