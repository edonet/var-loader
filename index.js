'use strict';


/**
 *************************************
 * 加载依赖
 *************************************
 */
const
    loaderUtils = require('loader-utils'),
    resolveAlias = require('./lib/resolveAlias'),
    createImporter = require('./lib/createImporter'),
    varRegExp = /\.(js|var)(\?.+)?$/;


/**
 *************************************
 * 缓存别名
 *************************************
 */
let loading = true;



/**
 *************************************
 * 定义加载器
 *************************************
 */
module.exports = function (content) {

    // 启用缓存
    this.cacheable && this.cacheable();

    // 是否已经加载过
    if (loading) {

        // 创建引入器
        let options = loaderUtils.getOptions(this) || {},
            varImporter = createImporter({
                data: options.data || {},
                test: options.test || varRegExp,
                alias: resolveAlias(this.options.resolve.alias)
            });


        // 添加【Sass】引入器
        for (let loader of this.loaders) {
            if (loader.path.indexOf('/node_modules/sass-loader/') !== -1) {

                // 添加配置
                if (!loader.options) {
                    loader.options = {};
                }

                // 添加引入模块
                if (loader.options.importer) {
                    loader.options.importer.push(varImporter);
                } else {
                    loader.options.importer = [varImporter];
                }

                // 返回
                break;
            }
        }

        // 修改标识
        loading = false;
    }

    // 返回源码
    return content;
};




