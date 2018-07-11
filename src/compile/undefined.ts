import { IPACompiler } from "../interface";
import bypasser from './util.bypasser';

const undefinedCompiler: IPACompiler = {
    condition: t => t === undefined,
    execute: () => () => bypasser,
};

export default undefinedCompiler;
