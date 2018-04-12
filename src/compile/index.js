import funcComp from './function';
import ipaComp from './ipa';
import arrComp from './array';
import boolComp from './boolean';
import nullComp from './null';
import numComp from './number';
import objComp from './object';
import undefinedComp from './undefined';
import strComp from './string';

const compilers = [
    funcComp,
    ipaComp,
    arrComp,
    boolComp,
    nullComp,
    numComp,
    objComp,
    undefinedComp,
    strComp,
];

const compile = (template) => {
    const compiler = compilers.find(item => item.condition(template));
    if (!compiler) throw new Error(`compile error: failed to recognize pattern ${JSON.stringify(template)}`);
    return compiler.execute(template)(compile);
};

export default compile;
