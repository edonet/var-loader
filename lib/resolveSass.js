'use strict';


/**
 *************************************
 * 解析【Sass】配置
 *************************************
 */
module.exports = function resolveSass(data) {

    // 返回字符串
    if (typeof data === 'string') {
        return data;
    }

    // 处理列表
    if (Array.isArray(data)) {
        return data.map(resolveSass).join('\n');
    }

    // 处理对象
    if (typeof data === 'object') {
        let keys = Object.keys(data),
            code = '';

        for (let name of keys) {
            code += `\$${ name }: ${ data[name] };\n`;
        }

        return code;
    }

    // 默认为空
    return '';
};
