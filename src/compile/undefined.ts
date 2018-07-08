import { IPACompiler } from "../interface";

const undefinedCompiler: IPACompiler = {
    condition: t => t === undefined,
    execute() {
        return () => ({
            check: () => true,
            guarantee: v => v,
            mock: () => undefined,
        });
    },
};

export default undefinedCompiler;
