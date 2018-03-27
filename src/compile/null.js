export default {
    condition: t => t === null,
    execute() {
        return () => ({
            check: v =>  v !== undefined,
            guarantee: v => v === undefined ? null : v,
            mock: () => null,
        });
    }
};