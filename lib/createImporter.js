'use strict';

const
    vm = require('vm'),
    path = require('path'),
    babel = require('babel-core'),
    babelOptions = {
        ast: false,
        babelrc: false,
        presets: [
            path.resolve(__dirname, '../node_modules/babel-preset-env')
        ]
    },
    resolveSass = require('./resolveSass');


module.exports = options => {

    let {
            test, data, alias
        } = options,
        cache = {};


    return function varImporter(url, context, callback) {

        // 生成异步对象
        if (!(url in cache)) {
            cache[url] = new Promise((resolve, reject) => {

                // 坐配置中获取
                if (url in data) {
                    return resolve({ contents: resolveSass(data[url]) });
                }

                // 过滤需要解析的文件
                if (!test.test(url)) {
                    return resolve(url);
                }

                let name = url;

                // 替换别名
                if (name.startsWith('~')) {
                    name = alias(name.slice(1));
                }

                // 获取文件路径
                name = path.resolve(path.dirname(context), name);

                // 加载文件
                babel.transformFile(name, babelOptions, (err, res) => {

                    // 返回错误
                    if (err) {
                        return reject(err);
                    }


                    // 编译模块
                    let script = new vm.Script(res.code),
                        model = { exports: {} },
                        sandbox = {
                            require,
                            module: model,
                            exports: model.exports,
                            __filename: name,
                            __dirname: path.dirname(name)
                        },
                        context = vm.createContext(sandbox);


                    // 获取模块
                    res = script.runInNewContext(context);
                    resolve({ contents: resolveSass(res) });
                });
            });
        }

        // 添加回调
        cache[url].then(callback, callback);
    };
};
