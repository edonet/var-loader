'use strict';


/**
 *************************************
 * 加载依赖
 *************************************
 */
const
    os = require('os'),
    home = os.homedir();


/**
 *************************************
 * 抛出接口
 *************************************
 */
module.exports = function createResolver(alias) {

    // 找不到别名
    if(typeof alias !== 'object' || Array.isArray(alias)) {
        return function(url) {
            return url.startsWith('/') ? (home + url) : url;
        };
    }

    // 生成别名列表
    alias = Object.keys(alias).map(function(key) {
        let onlyModule = false,
            obj = alias[key];

        if(/\$$/.test(key)) {
            onlyModule = true;
            key = key.substr(0, key.length - 1);
        }

        if(typeof obj === 'string') {
            obj = {
                alias: obj
            };
        }

        obj = Object.assign({
            name: key,
            onlyModule: onlyModule
        }, obj);

        return obj;
    });


    // 返回别名函数
    return function(url) {

        // 替换用户
        if (url.startsWith('/')) {
            return home + url;
        }

        // 替换别名
        alias.forEach(function(obj) {
            let name = obj.name;

            if(url === name || (!obj.onlyModule && url.startsWith(name + '/'))) {
                url = obj.alias + url.substr(name.length);
            }
        });

        // 返回路径
        return url;
    };
};
