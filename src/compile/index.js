import funcCompiler from './funcCompiler/index';
import ipaCompiler from './ipaCompiler';

const compilers = [
    funcCompiler,
    ipaCompiler,
]

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