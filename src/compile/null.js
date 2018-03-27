export default {
    condition: t => t === null,
    execute(template) {
        () => ({
            check: v =>  v!== undefined,
            guarantee: v => v=== undefined ? null : v,
            mock: () => null,
        });
    }
};