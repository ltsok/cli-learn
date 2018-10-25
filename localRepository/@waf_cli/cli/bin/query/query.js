const identifier = '[query]';
const os = require('os');
const fs = require('fs-extra');
const config = require('../common/config.js');
const utils = require('../common/utils.js');

var query = {
    onLs: function (input) {

        config.default();

        let user_waf_cfg = os.homedir().replace(/\\/g, '/') + '/.waf/waf-config.json';
        if (fs.existsSync(user_waf_cfg)) {

            // 获取用户级的所有产品配置
            let cfgs = require(user_waf_cfg);
            let contents = [];

            if (input && input.length > 0) {

                // 显示指定产品配置
                cfgs.products.forEach((prod) => {
                    if (input === prod.name) {
                        contents.push(['产品名称-name', prod.name]);
                        contents.push(['代码路径-localCode', prod.localCode]);
                        contents.push(['环境路径-localRep', prod.localRep]);
                        contents.push(['归档路径-dist', prod.dist]);
                        contents.push(['选择模板-templet', prod.customization.templet]);
                        contents.push(['默认主题-defaultTheme', prod.customization.defaultTheme]);
                        contents.push(['默认语言-defaultLang', prod.customization.defaultLang]);
                    } 
                });

                let tableInfo = {
                    widths: [25, 50],
                    titles: ['配置名称', '配置值'],
                    contents: contents
                }
                utils.cliTable(tableInfo);

            } else {

                // 显示所有产品概况
                let curProd = cfgs.select;
                cfgs.products.forEach((prod) => {
                    if (curProd === prod.name) {
                        contents.push(['*', prod.name]);
                    } else {
                        contents.push(['', prod.name]);
                    }
                });

                let tableInfo = {
                    widths: [8, 20],
                    titles: ['当前状态', '产品名称'],
                    contents: contents
                }
                utils.cliTable(tableInfo);
            }

        } else {
            throw new Error(identifier + "不存在产品配置信息，请确认:" + user_waf_cfg);
        }
    }
};
module.exports = query;