import { IPALike } from "../lib/peer-classes";
import { IPACompiler } from "../interface";

const ipaInstanceCompiler: IPACompiler = {
    condition(template) {
        return Boolean(template && (template instanceof IPALike));
    },
    execute(template) {
        return () => template.core;
    },
};

export default ipaInstanceCompiler;
