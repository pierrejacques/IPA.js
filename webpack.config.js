const os = require('os');
const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const pkg = require('./package.json');
// const version = pkg.version;
const name = pkg.name;

function resolve (dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    entry: "./src/index.js",
    output: {
        path: resolve('dist'),
        filename: `${name.toLowerCase()}.min.js`,
        libraryTarget: "umd", // 测试阶段打包选项
    },
    resolve: {
        alias: {
            '@': resolve('src'),
        }
    },
    plugins:[
        new uglify()
    ],
    module: {
        rules: [{
            test: /\.js$/,
            loader: ['babel-loader?cacheDirectory=true'],
            include: [resolve('src'), resolve('test'), resolve('node_modules/vue-echarts')]
        }]
    }
};
