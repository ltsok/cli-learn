const identifier = '[func]';
const config = require('../common/config.js');

var func = {

    /**
     * 获取waf模块包
     * @returns 
     */
    getWafPkg: function () {
        return ['waf_resource', 'waf_service', 'waf_component', 'waf_templet', 'waf_func'];
    },

    /**
     * 处理各个模块(注：输入参数由调用端保证正确性)
     */
    excute: function (input, callback) {

        // 加载全局配置
        config.default();
        if ('waf_resource' === input) {

            // 处理waf_resource下所有模块
            config.moduleData.resourceModules.forEach(module => {

                callback(module);
            });

        } else if ('waf_service' === input) {

            // 处理waf_service下所有模块
            config.moduleData.serviceModules.forEach(module => {

                callback(module);
            });

        } else if ('waf_component' === input) {

            // 处理waf_component下所有模块
            // 1.处理WAF第三方组件库引入模块
            // 2.处理WAF的所有组件模块
            config.moduleData.libModules.forEach(module => {

                callback(module);
            });

            config.moduleData.componentModules.forEach(module => {

                callback(module);
            });

        } else if ('waf_templet' === input) {

            // 处理当前模板下所有模块
            config.moduleData.templetModules.forEach(module => {

                callback(module);
            });

        } else if ('waf_func' === input) {

            // 处理waf_func下所有模块
            config.moduleData.funcModules.forEach(module => {

                callback(module);
            });

        } else if ('product' === input) {

             // 处理所有产品资源模块
             config.moduleData.productResourceModules.forEach(module => {

                callback(module);
            });

            // 处理所有产品组件
            config.moduleData.productComponentModules.forEach(module => {

                callback(module);
            });

            // 处理所有产品模块
            config.moduleData.productModules.forEach(module => {

                callback(module);
            });

        } else {

            // 根据模块名称找到对应的模块包并处理
            input.forEach(moduleName => {

                // 匹配标志
                let flag = false;

                // 找到匹配的模块信息
                let data = config.moduleData;
                for (let key in data) {
                    for (let index = 0; index < data[key].length; index++) {
                        const element = data[key][index];
                        if (element.name === moduleName) {
                            callback(element);
                            flag = true;
                            break;
                        }
                    }

                    if (flag) {
                        break;
                    }
                }

                // 输入的模块不存在则报错
                if (!flag) {
                    throw new Error(identifier + '无此模块:' + moduleName);
                }
            })
        }
    }
};
module.exports = func;