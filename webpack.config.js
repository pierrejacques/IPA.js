var os = require('os');
var path = require('path');
var uglify = require('uglifyjs-webpack-plugin');

function resolve (dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    entry: "./src/index.js",
    output: {
        path: resolve('dist'),
        filename: "bundle.js",
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
