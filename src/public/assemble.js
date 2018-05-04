export default (checker, guaranteer, mocker) => (compile) => {
    const checke = compile(checker);
    const guarantee = compile(guaranteer);
    const mocke = compile(mocker);
    return {
        checke,
        guarantee,
        mock,
    };
};