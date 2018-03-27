export default {
    condition: t => t === undefined,
    execute(template) {
        return () => ({
            check: () => true,
            guarantee: v => v,
            mock: () => undefined,
        })
    }
}