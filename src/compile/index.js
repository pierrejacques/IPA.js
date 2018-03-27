import funcCompiler from './func/index';
import ipaCompiler from './ipa';
import arrayCompiler from './array';
import booleanCompiler from './boolean';
import nullCompiler from './null';
import numberCompiler from './number';
import objectCompiler from './object';
import undefinedCompiler from './undefined';
import stringCompiler from './string';

const compilers = [
    funcCompiler,
    ipaCompiler,
    arrayCompiler,
    booleanCompiler,
    nullCompiler,
    numberCompiler,
    objectCompiler,
    undefinedCompiler,
    stringCompiler,
];

const compile = template => {
    let strategy;
    for (let i = 0; i < compilers.length; i++) {
        if (compilers[i].condition(template)) {
            strategy = compilers[i].execute(template);
            break;
        }
    }
    if (!strategy) throw new Error(`compile error: failed to recognize pattern ${JSON.stringify(template)}`);
    return strategy(compile);
};

export default compile;