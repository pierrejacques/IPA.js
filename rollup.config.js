import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
    input: 'src/index.js',
    output: {
        format: 'cjs',
        file: 'dist/ipa.js',
    },
    plugins: [
        replace({ // minimize the size
            Strat: 'S',
            getterProps: 'g',
            bothProps: 'b',
            delimiters: ['', '']
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        uglify(),
    ],
    external: [
        'lodash',
    ]
};
