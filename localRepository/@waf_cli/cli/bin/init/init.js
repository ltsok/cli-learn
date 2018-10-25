const identifier = '[init]';
const os = require('os');
const fs = require('fs-extra');
const config = require('../common/config.js');
const utils = require('../common/utils.js');

var init = {

    onInit: function () {

        // 获取模板选项
        let templetOptions = [];
        config.getWafCfg().templet.templets.forEach((element) => {
            templetOptions.push(element[0]);
        });

        // 定义初始化步骤
        let steps = [
            { name: 'name', prompt: '请输入产品名称', require: true },
            { name: 'localCode', prompt: '请输入产品本地代码路径', require: true },
            { name: 'localRep', prompt: '请输入本地环境路径', default: 'D:/rep' },
            { name: 'dist', prompt: '请输入归档路径', default: 'D:/dist' },
            { name: 'cusTemplet', prompt: '请选择模板', type: 'selection', options: templetOptions },
            { name: 'defaultTheme', prompt: '请输入默认主题', type: 'selection', options: ["darkness", "lightness"] },
            { name: 'defaultLang', prompt: '请输入默认语言', type: 'selection', options: ["zh", "en"] },
            { name: 'defaultFuncs', prompt: '请输入默认功能名称', type: 'list' }
        ];

        // 执行交互命令
        utils.interCmd("初始化WAF本地环境", steps, (obj) => {

            // 当前用户级的产品配置对象
            let cfg = {
                name: obj.name,
                localCode: obj.localCode,
                localRep: obj.localRep,
                dist: obj.dist,
                version: '1.0.0',
                customization: {
                    templet: obj.cusTemplet,
                    defaultTheme: obj.defaultTheme,
                    defaultLang: obj.defaultLang,
                    defaultFuncs: obj.defaultFuncs
                }
            }

            // 1.操作用户级的产品配置文件
            let cfgFile = os.homedir().replace(/\\/g, '/') + '/.waf/waf-config.json';
            if (fs.pathExistsSync(cfgFile)) {

                // 用户级的产品配置文件不存在则先备份
                fs.copySync(cfgFile, cfgFile + utils.getCurDate());

                // 然后添加新的产品信息
                let cfgInfo = require(cfgFile);
                cfgInfo.select = obj.name;

                // 整理产品配置信息：名称相同则覆盖
                let newProducts = [];
                let flag = false;
                cfgInfo.products.forEach((prod) => {
                    if (obj.name === prod.name) {
                        newProducts.push(cfg);
                        flag = true;
                    } else {
                        newProducts.push(prod);
                    }
                });

                // 如果没有相同的则新加一个
                if (!flag) {
                    newProducts.push(cfg);
                }

                cfgInfo.products = newProducts;

                fs.removeSync(cfgFile);
                fs.outputFileSync(cfgFile, JSON.stringify(cfgInfo, null, 2));
            } else {
                // 用户级的产品配置文件不存在则创建
                fs.outputFileSync(cfgFile, JSON.stringify({ select: obj.name, products: [cfg] }, null, 2));
            }


            // 2.生成产品目录(没有则创建)
            config.default();
            fs.ensureDirSync(config.productModulesDir);
            fs.ensureDirSync(config.productResourceDir);
            fs.ensureDirSync(config.productComponentDir);

            // 3.生成国际化全局资源模块(没有则创建)
            let i18n = config.productResourceDir + '/i18n';
            if (!fs.pathExistsSync(i18n)) {

                let i18nPackage = {
                    name: config.productResourcePkg + "/i18n",
                    version: "1.0.0",
                    description: "",
                    files: ["i18n.xlsx", "package.json"]
                }

                fs.outputFileSync(__dirname + '/i18n/package.json', JSON.stringify(i18nPackage, null, 2));
                fs.copySync(__dirname + '/i18n', config.productResourceDir + '/i18n');
            }

            // 4.生成图标全局资源模块(没有则创建)
            let iconfont = config.productResourceDir + '/iconfont';
            if (!fs.pathExistsSync(iconfont)) {

                let iconfontPackage = {
                    name: config.productResourcePkg + "/iconfont",
                    version: "1.0.0",
                    license: "MIT",
                    files: ["src", "package.json"]
                }

                fs.outputFileSync(__dirname + '/iconfont/package.json', JSON.stringify(iconfontPackage, null, 2));
                fs.copySync(__dirname + '/iconfont', config.productResourceDir + '/iconfont');
            }

            console.log(identifier + 'WAF本地目录/配置初始化成功');

            // 5.执行初始化流程(本地rep中没有此模板才初始化)
            if (!fs.pathExistsSync(config.repDir)) {
                init.onReInit();
            }
        });
    },

    onReInit: function () {

        // 载入全局配置
        config.default();

        // 初始化WAF本地环境
        try {
            initRepository();
            init.downloadTemplet();
            console.log(identifier + 'WAF本地环境初始化成功:' + config.repDir);
        } catch (error) {
            console.error(identifier + 'WAF本地环境初始化失败:');
            console.error(error);
            throw new Error(error);
        }

        /**
        * 目录初始化本地仓库
        */
        function initRepository() {
            fs.removeSync(config.repDir);
            fs.mkdirsSync(config.repDir);
            console.log(identifier + 'WAF本地库清理成功:' + config.repDir);
        }
    },

    downloadTemplet: function () {

        // 生成临时
        fs.mkdirsSync(config.tmpDir);
        fs.outputJSONSync(config.tmpDir + "/package.json", { name: config.templetPkg + "/tmp", version: "1.0.0", description: "tmp", repository: "/", license: "MIT" });

        // 下载当前模板
        let cmdDownload = 'npm install ' + config.templetPkg + '/' + config.curTemplet + '@' + config.templet.version;
        utils.runCmd(cmdDownload, config.tmpDir);
        fs.copySync(config.tmpDir + '/node_modules/' + config.templetPkg + '/' + config.curTemplet + '/framework', config.frameworkDir);
        fs.removeSync(config.tmpDir);
        console.log(identifier + 'WAF模板下载成功:' + config.repDir);
    }
};
module.exports = init;