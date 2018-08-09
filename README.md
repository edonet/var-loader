# var-loader
string variable replace loader for webpack

## Installation
npm
``` shell
$ npm install var-loader
```

or yarn
``` shell
$ yarn add var-loader
```

## Usage
``` javascript
// webpack.config.js
module.exports = {
	...
    module: {
        rules: [{
            test: /\.tpl$/,
            use: [
                'raw-loader',
                {
                    loader: 'var-loader',
                    options: {

                        // the string will to replaced as regexp
                        find: /\$\{(.*?)\}/g

                        // the replace function as a value to return
                        replace: (key, val) => ['prefix', key, val].join('-'),

                        // the replace variable map
                        data: {
                            name: 'value'
                        }
                    }
                }
            ]
        }]
    }
};
```
