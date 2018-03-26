import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    output: {
        format: 'cjs',
        file: 'dist/ipa.js'
    },
    plugins: [ 
        babel(),
    ],
    external: [
        'lodash',
    ]
};