import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'src/index.ts',
    output: {
        format: 'umd',
        name: 'IPA',
        globals: 'lodash',
        file: 'dist/ipa.js',
    },
    plugins: [
        typescript(),
    ],
    external: [
        'lodash',
    ]
};