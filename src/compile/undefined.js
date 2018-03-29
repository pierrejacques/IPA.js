export default {
    condition: t => t === undefined,
    execute() {
        return () => ({
            check: () => true,
            guarantee: v => v,
            mock: () => undefined,
        });
    },
};
