import { IPACompiler, IPAContext, IPACompileFunction } from '../interface';

import { publicCache } from '../lib/cache';
import catcher from '../lib/catcher';

import funcComp from './function';
import ipaComp from './ipa';
import arrComp from './array';
import boolComp from './boolean';
import nullComp from './null';
import numComp from './number';
import objComp from './object';
import undefinedComp from './undefined';
import strComp from './string';

const compilers: Array<IPACompiler> = [
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

const context: IPAContext = {
    compile: null,
    cache: publicCache,
    catcher,
};

const compile: IPACompileFunction = (template)=> {
    const compiler = compilers.find(item => item.condition(template));
    if (!compiler) throw new Error(`compile error: failed to recognize pattern ${JSON.stringify(template)}`);
    return compiler.execute(template)(context);
};

context.compile = compile;

export default compile;
