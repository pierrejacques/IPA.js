import functionCompiler from './function';
import ipaCompiler from './ipa';
import arrayCompiler from './array';
import booleanCompiler from './boolean';
import nullCompiler from './null';
import numberCompiler from './number';
import objectCompiler from './object';
import undefinedCompiler from './undefined';
import stringCompiler from './string';

const compilers = [
    functionCompiler,
    ipaCompiler,
    arrayCompiler,
    booleanCompiler,
    nullCompiler,
    numberCompiler,
    objectCompiler,
    undefinedCompiler,
    stringCompiler,
];

const compile = (template) => {
    const compiler = compilers.find(item => item.condition(template));
    if (!compiler) throw new Error(`compile error: failed to recognize pattern ${JSON.stringify(template)}`);
    return compiler.execute(template)(compile);
};

export default compile;
