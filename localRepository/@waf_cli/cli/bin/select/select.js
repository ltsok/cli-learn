const identifier = '[select]';
const os = require('os');
const fs = require('fs-extra');

var select = {

    onUse: function (input) {

        let cfgFile = os.homedir().replace(/\\/g, '/') + '/.waf/waf-config.json';
        if (fs.existsSync(cfgFile)) {

            // 获取用户级的所有产品配置
            let cfgs = require(cfgFile);

            // 输入的产品名称是否存在
            let flag = false;
            cfgs.products.forEach((prod) => {
                if (input === prod.name) {
                    flag = true;
                }
            });

            // 存在则修改选中产品，否则报错
            if (flag) {
                cfgs.select = input;
                fs.removeSync(cfgFile);
                fs.outputFileSync(cfgFile, JSON.stringify(cfgs, null, 2));

                console.log(identifier + '切换产品成功:' + input);
            } else {
                throw new Error(identifier + "输入的产品不存在:" + input);
            }

        } else {
            throw new Error(identifier + "不存在产品配置信息，请确认:" + cfgFile);
        }

    }
};
module.exports = select;