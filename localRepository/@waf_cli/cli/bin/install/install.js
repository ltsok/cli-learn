const identifier = '[install]';
const fs = require('fs-extra');
const utils = require('../common/utils.js');
const config = require('../common/config.js');
const update = require('../update/update.js');

var install = {

    onInstall: function () {

        // 载入全局配置
        config.default();

        try {
            // 1.更新产品所有模块
            update.onUpdate();

            // 2.生成根模块、package.json、tsconfig.json
            // 3.下载对应的依赖
            genRootModule();
            genPackageJson();
            genTsConfigJson();
            utils.runCmd('npm install', config.frameworkDir);
            console.log(identifier + 'WAF本地环境安装成功');
        } catch (error) {
            console.error(identifier + 'WAF本地环境安装失败:');
            console.error(error);
            throw new Error(error);
        }

        /**
         * 生成WAF和产品的TypeScript的配置文件
         */
        function genTsConfigJson() {
            let tsConfig_ftl = '/src/ftl/tsconfig.ftl';
            let result = utils.renderFile(config.frameworkDir, tsConfig_ftl, { baseUrl: config.repDir + '/framework/node_modules' });

            let wafTsConfig_json;
            if (fs.pathExistsSync(config.localCode)) {
                wafTsConfig_json = config.localCode + '/tsconfig.json';
                fs.outputFileSync(wafTsConfig_json, result);
                console.log(identifier + 'WAF的TypeScript的配置文件创建成功：' + wafTsConfig_json);
            }

            let prodTsConfig_json = config.product.localCode + '/tsconfig.json';
            fs.outputFileSync(prodTsConfig_json, result);
            console.log(identifier + '产品的TypeScript的配置文件创建成功：' + prodTsConfig_json);
        }

        /**
         * 生成Angualr根模块文件
         */
        function genRootModule() {

            let rootModule_ts = config.frameworkDir + '/src/app/app.module.ts';
            let rootModule_ftl = '/src/ftl/app.module.ftl';

            let result = utils.renderFile(config.frameworkDir, rootModule_ftl, config.moduleData);
            fs.chmodSync(rootModule_ts, '777');
            fs.outputFileSync(rootModule_ts, result);
            console.log(identifier + 'WAF的根模块文件创建成功:' + rootModule_ts);
        }

        /**
         * 生成Angualr工程对应的package.json
         */
        function genPackageJson() {

            let package_json = config.frameworkDir + '/package.json';
            let package_ftl = '/src/ftl/package.ftl';

            let result = utils.renderFile(config.frameworkDir, package_ftl, config.moduleData);
            fs.chmodSync(package_json, '777');
            fs.outputFileSync(package_json, result);
            console.log(identifier + 'WAF的package.json文件创建成功:' + package_json);
        }
    }
};
module.exports = install;