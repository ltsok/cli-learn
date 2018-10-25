const identifier = '[update]';
const fs = require('fs-extra');
const utils = require('../common/utils.js');
const func = require('../common/func.js');
const config = require('../common/config.js');
const init = require('../init/init.js');

var update = {

    onUpgrade: function (input) {

        // 载入全局配置
        config.default();

        // 更新所有模块包中的模块
        console.log(identifier + '开始升级模块包...');
        init.downloadTemplet();
        console.log(identifier + '完成WAF模板框架的升级');
        func.getWafPkg().forEach((pkg) => {
            if ('waf_templet' === pkg) {
                fs.removeSync(config.frameworkDir + '/node_modules/' + config.curModulesPkg);
            } else {
                fs.removeSync(config.frameworkDir + '/node_modules/@' + pkg);
            }
        });
        const install = require('../install/install.js');
        install.onInstall();
        console.log(identifier + '完成WAF模块的升级');
    },

    onUpdate: function (input, cmd) {

        // 载入全局配置
        config.default();

        if (cmd && cmd.waf) {

            // 更新所有waf模块包
            func.getWafPkg().forEach((pkg) => func.excute(pkg, (module) => doUpdate(module)));

        } else if (cmd && cmd.waf_pkg) {

            // 更新waf模块包
            let steps = [
                {
                    name: 'pkg',
                    prompt: '请输入要更新的waf模块包',
                    type: 'selection',
                    options: func.getWafPkg()
                },
            ];

            // 执行交互命令
            utils.interCmd("更新WAF模块包", steps, (obj) => func.excute(obj.pkg, (module) => doUpdate(module)));

        } else if (cmd && cmd.waf_mod) {

            // 更新waf模块
            let steps = [
                {
                    name: 'mod',
                    prompt: '请输入要更新的waf模块，多个模块以空格分割',
                    require: true
                },
            ];

            // 执行交互命令
            utils.interCmd("更新WAF模块", steps, (obj) => {

                // 获取输入的模块名字
                let moduleNames = obj.mod.split(' ');

                // 不能是模块包
                moduleNames.forEach((name) => {
                    if (utils.contains(func.getWafPkg(), name)) {
                        throw new Error(identifier + '不能输入模块包名:' + name);
                    }
                });

                func.excute(moduleNames, (module) => doUpdate(module));
            });

        } else if (cmd && cmd.waf_rep) {

            const install = require('../install/install.js');

            // 更新waf本地环境
            fs.removeSync(config.frameworkDir + '/src');
            fs.copySync(config.curFrameworkDir, config.frameworkDir);
            install.onInstall();
            console.log(identifier + '本地环境更新成功:' + config.repDir);
        }
        else {

            // 更新产品模块
            if (input && input.length > 0) {

                // 只能输入产品模块
                input.forEach((moduleName) => {

                    let flag = false;
                    for (let index = 0; index < config.moduleData.productModules.length; index++) {
                        if (moduleName === config.moduleData.productModules[index].name) {
                            flag = true;
                            break;
                        }
                    }

                    if (!flag) {
                        throw new Error(identifier + '无此产品模块:' + moduleName);
                    }
                });

                // 更新产品指定模块
                func.excute(input, (module) => doUpdate(module, (cmd && cmd.cover)));

            } else {

                // 默认更新产品的所有模块
                func.excute('product', (module) => doUpdate(module,(cmd && cmd.cover)));
            }
        }

        /**
         * 更新操作
         * @param {*} module
         * @param {*} isCover
         */
        function doUpdate(module, isCover) {

            // 业务模块原宿路径
            let src = module.localDir;
            let dest = config.frameworkDir + '/node_modules/' + module.pkg + '/' + module.name;

            try {

                // 更新模块文件
                if (isCover) {
                    fs.copySync(src, dest);
                } else {
                    fs.removeSync(dest);
                    fs.copySync(src, dest);
                }
                console.log(identifier + '模块更新成功:' + src + ' -- ' + dest)

            } catch (err) {
                console.error(identifier + '模块更新失败' + src + ' -- ' + dest + ':');
                console.error(err);
                throw new Error(err);
            }
        }
    }
};
module.exports = update;