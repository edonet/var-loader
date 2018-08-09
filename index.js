/**
 *****************************************
 * Created by lifx
 * Created on 2018-08-09 10:39:41
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const utils = require('loader-utils');


/**
 *****************************************
 * 加载器
 *****************************************
 */
module.exports = function loader(code) {
    let options = utils.getOptions(this) || {},
        find = options.find || /\$\{(.*?)\}/g,
        replace = options.replace,
        data = {
            ...options.data,
            ...utils.parseQuery(this.resourceQuery || '?')
        };

    // 查找替换
    if (find) {
        code = code.replace(find, (str, $1) => {
            let [key, val = ''] = $1.split(':');

            // 去除空白
            key = key && key.trim();
            val = val && val.trim();

            // 替换数据
            if (key) {
                return key in data ? data[key] : replace ? replace(key, val) || val : val;
            }

            // 返回默认值
            return val;
        });
    }

    // 返回代码
    return code;
};
