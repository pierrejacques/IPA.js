import { IPACompiler } from "../interface";

const nullCompiler: IPACompiler = {
    condition: t => t === null,
    execute() {
        return ({ catcher }) => ({
            check: v => catcher.catch("defined", v !== undefined),
            guarantee: v => v === undefined ? null : v,
            mock: () => null,
        });
    },
};
export default nullCompiler;