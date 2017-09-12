'use strict';


/**
 *************************************
 * 加载依赖
 *************************************
 */
const
    loaderUtils = require('loader-utils'),
    varImporter = require('var-importer');


/**
 *************************************
 * 缓存别名
 *************************************
 */
let sassLoader = null,
    proxy = null,
    addDependency = name => {
        return proxy && proxy.addDependency(name);
    };


/**
 *****************************************
 * 定义变量加载器
 *****************************************
 */
function varLoader(...args) {
    proxy = this;
    return sassLoader.apply(proxy, args);
}



/**
 *************************************
 * 定义加载器
 *************************************
 */
module.exports = function (content) {
    let idx = this.loaderIndex,
        loader;


    while (idx) {
        loader = this.loaders[idx --];

        // 查找【sass】加载器
        if (loader.path.indexOf('/sass-loader/') !== -1) {

            // 初始化加载器
            if (!sassLoader) {
                let options = loaderUtils.getOptions(this) || {},
                    importer = varImporter(Object.assign({}, options, {
                        alias: this.options.resolve.alias,
                        callback: addDependency
                    }));


                // 缓存【sass】加载器
                sassLoader = loader.normal;

                // 添加配置
                if (!loader.options) {
                    loader.options = {};
                }

                // 添加引入模块
                if (loader.options.importer) {
                    loader.options.importer.push(importer);
                } else {
                    loader.options.importer = [importer];
                }
            }

            // 替换加载器
            if (loader.normal !== varLoader) {
                loader.normal = varLoader;
            }

            break;
        }
    }

    return content;
};




