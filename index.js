'use strict';


/**
 *************************************
 * 加载依赖
 *************************************
 */
const
    fs = require('fs'),
    path = require('path'),
    mime = require('mime'),
    loaderUtils = require('loader-utils'),
    resolveAlias = require('./resolveAlias'),
    urlRegExp = /url\((.+)\?(.+)\)/g,
    typeRegExp = /\.(svg|tpl)/,
    cache = {};


/**
 *************************************
 * 定义加载器
 *************************************
 */
let alias = null;
module.exports.raw = true;
module.exports = function(content) {

    this.cacheable && this.cacheable();

    if (!alias) {
        alias = resolveAlias(this.options.resolve.alias);
    }

    try {

        let {
                replace = urlRegExp,
                fileType = typeRegExp
            } = loaderUtils.getOptions(this) || {},
            dir = path.dirname(this.resourcePath);

        return content
            .toString()
            .replace(replace, (patt, $1, $2) => {

                if (!fileType.test($1)) {
                    return patt;
                }

                let query = $2.split('&');

                if (query.length) {

                    let src = path.resolve(dir, /^~/.test($1) ? alias($1.slice(1)): $1);


                    if (!(src in cache)) {
                        cache[src] = {
                            code: fs.readFileSync(src).toString(),
                            mimetype: mime.lookup(src)
                        };

                        cache[src].base64 = cache[src].mimetype.startsWith('image/');
                    }

                    let { code, mimetype, base64 } = cache[src];


                    query.forEach(item => {
                        let [key, val] = item.split('='),
                            regexp = new RegExp('\\$' + key, 'g');

                        code = code.replace(regexp, val);
                    });


                    if (base64) {
                        code = Buffer.from(code).toString('base64');
                        return `url(data:${mimetype ? mimetype + ';' : ''}base64,${code})`;
                    }

                    return code;
                }

                return patt;
            });

    } catch (ex) {
        console.error(ex);
    }

    return content;
};




