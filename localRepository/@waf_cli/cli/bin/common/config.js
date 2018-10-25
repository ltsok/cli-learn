const os = require('os');
const fs = require('fs-extra');
const utils = require('../common/utils.js');
const identifier = '[config]';

var config = {

    default: function () {

        // 加载过了就直接返回
        if (this.loadFlag) { return this; }

        // 获取WAF配置
        let waf_cli = config.getWafCfg();

        // 获取产品配置
        let waf_cfg = config.getProdCfg();

        // 设置基本配置
        this.setConfig(waf_cli, waf_cfg);

        // 设置模块常用信息配置
        this.moduleData = this.getModuleData();

        // 置位加载标志
        this.loadFlag = true;
        return this;
    },

    getWafCfg: function () {

        // 默认WAF配置文件
        let waf_cli = require('../waf-cli.json');

        // 用户级的WAF配置文件，若存在则覆盖默认的
        let user_waf_cli = os.homedir().replace(/\\/g, '/') + '/.waf/waf-cli.json';
        if (fs.existsSync(user_waf_cli)) {
            waf_cli = require(user_waf_cli);
        }

        return waf_cli;
    },

    getProdCfg: function () {

        // 只存在用户级的产品配置，若不存在则打印日志提醒
        let waf_cfg;
        let user_waf_cfg = os.homedir().replace(/\\/g, '/') + '/.waf/waf-config.json';
        if (fs.existsSync(user_waf_cfg)) {

            // 获取用户级的所有产品配置
            let waf_cfgs = require(user_waf_cfg);

            // 设置当前选中的产品
            let curProd = waf_cfgs.select;
            waf_cfgs.products.forEach((prod) => {
                if (curProd === prod.name) {
                    waf_cfg = prod;
                }
            });
        } else {
            throw new Error(identifier + "不存在产品配置信息，请确认:" + user_waf_cfg);
        }

        return waf_cfg;
    },

    reLoad: function () {

        this.loadFlag = false;
        this.default();
        return this;
    },

    setConfig: function (waf_cli, waf_cfg) {

        /** 开始：WAF本地代码的配置 */
        this.svn = waf_cli.svn;
        this.localCode = waf_cli.localCode;

        // 当前WAF模板的配置
        this.templet = waf_cli.templet;
        this.templetPkg = this.templet.dir.replace(/\//, '@');
        this.templetDir = this.localCode + this.templet.dir;

        // WAF服务的配置
        this.service = waf_cli.service;
        this.servicePkg = this.service.dir.replace(/\//, '@');
        this.serviceDir = this.localCode + this.service.dir;

        // WAF组件的配置
        this.component = waf_cli.component;
        this.componentPkg = this.component.dir.replace(/\//, '@');
        this.componentDir = this.localCode + this.component.dir;

        // WAF功能的配置
        this.func = waf_cli.func;
        this.funcPkg = this.func.dir.replace(/\//, '@');
        this.funcDir = this.localCode + this.func.dir;

        // WAF资源的配置
        this.resource = waf_cli.resource;
        this.resourcePkg = this.resource.dir.replace(/\//, '@');
        this.resourceDir = this.localCode + this.resource.dir;
        /** 结束：WAF本地代码的配置 */

        /** 开始：产品本地代码的配置 */
        this.product = waf_cfg;
        this.productModulesPkg = '@' + this.product.name;
        this.productResourcePkg = '@' + this.product.name + '_resource';
        this.productComponentPkg = '@' + this.product.name + '_component';
        this.productModulesDir = this.product.localCode + '/modules';
        this.productResourceDir = this.product.localCode + '/resource';
        this.productComponentDir = this.product.localCode + '/component';

        this.curTemplet = this.product.customization.templet;
        this.curTempletDir = this.localCode + this.templet.dir + '/' + this.curTemplet;
        this.curFrameworkDir = this.curTempletDir + '/framework';
        this.curModulesDir = this.curTempletDir + '/modules';
        this.curModulesPkg = '@' + this.curTemplet;
        /** 结束：产品本地代码的配置 */

        /** 开始：本地库的配置 */
        this.backDir = this.product.localRep + '/bak';
        this.repDir = this.product.localRep + '/' + this.curTemplet;
        this.tmpDir = this.repDir + '/tmp';
        this.frameworkDir = this.repDir + '/framework';
        /** 结束：本地库的配置 */
    },

    getModuleData: function () {

        // 获取WAF的模块信息
        let resourceModules = [];
        this.resource.names.forEach(name => {

            resourceModules.push(
                {
                    name: name.toLowerCase(),
                    camelName: utils.toCamelName(name),
                    localDir: this.resourceDir + '/' + name.toLowerCase(),
                    pkg: this.resourcePkg,
                    version: this.resource.version
                }
            );
        });
        console.log(identifier + 'WAF资源模块:' + this.resource.names);

        let serviceModules = [];
        this.service.names.forEach(name => {

            serviceModules.push(
                {
                    name: name.toLowerCase(),
                    camelName: utils.toCamelName(name),
                    localDir: this.serviceDir + '/' + name.toLowerCase(),
                    pkg: this.servicePkg,
                    version: this.service.version
                }
            );
        });
        console.log(identifier + 'WAF服务模块:' + this.service.names);

        let templetModules = [];
        let templetModuleNames = getTempletModuleNames(this.curTemplet);
        templetModuleNames.forEach(name => {

            templetModules.push(
                {
                    name: name.toLowerCase(),
                    camelName: utils.toCamelName(name),
                    localDir: this.curModulesDir + '/' + name.toLowerCase(),
                    pkg: this.curModulesPkg,
                    version: this.templet.version
                }
            );
        });
        console.log(identifier + 'WAF模板模块:' + templetModuleNames);

        let libModules = [];
        this.component.lib.names.forEach(name => {

            libModules.push(
                {
                    name: name.toLowerCase(),
                    camelName: utils.toCamelName(name),
                    localDir: this.componentDir + this.component.lib.dir + '/' + name.toLowerCase(),
                    pkg: this.componentPkg,
                    version: this.component.lib.version
                }
            );
        });
        console.log(identifier + 'WAF组件依赖库:' + this.component.lib.names);

        let componentModules = [];
        this.component.widget.names.forEach(name => {
            componentModules.push(
                {
                    name: name.toLowerCase(),
                    camelName: utils.toCamelName(name),
                    localDir: this.componentDir + this.component.widget.dir + '/' + name.toLowerCase(),
                    pkg: this.componentPkg,
                    version: this.component.widget.version
                }
            );
        });
        console.log(identifier + 'WAF组件库:' + this.component.widget.names);

        let funcModules = [];
        let defaultFuncs = this.product.customization.defaultFuncs;
        if (defaultFuncs) {
            defaultFuncs.forEach(name => {
                funcModules.push(
                    {
                        name: name.toLowerCase(),
                        camelName: utils.toCamelName(name),
                        localDir: this.funcDir + '/' + name.toLowerCase(),
                        pkg: this.funcPkg,
                        version: this.func.version
                    }
                );
            });
            console.log(identifier + 'WAF功能库:' + this.func.names);
            console.log(identifier + '当前使用的WAF功能库:' + defaultFuncs);
        } else {
            console.log(identifier + '沒有使用WAF功能库');
        }


        let productResourceModules = [];
        let productResourceNames = utils.getDirectChildDirs(this.productResourceDir)
        productResourceNames.forEach(name => {

            productResourceModules.push(
                {
                    name: name.toLowerCase(),
                    camelName: utils.toCamelName(name),
                    localDir: this.productResourceDir + '/' + name.toLowerCase(),
                    pkg: this.productResourcePkg,
                    version: this.product.version
                }
            );
        });
        console.log(identifier + '产品资源库:' + productResourceNames);

        let productComponentModules = [];
        let productComponentNames = utils.getDirectChildDirs(this.productComponentDir)
        productComponentNames.forEach(name => {

            productComponentModules.push(
                {
                    name: name.toLowerCase(),
                    camelName: utils.toCamelName(name),
                    localDir: this.productComponentDir + '/' + name.toLowerCase(),
                    pkg: this.productComponentPkg,
                    version: this.product.version
                }
            );
        });
        console.log(identifier + '产品组件库:' + productComponentNames);

        let productModules = [];
        let productModuleNames = utils.getDirectChildDirs(this.productModulesDir)
        productModuleNames.forEach(name => {

            productModules.push(
                {
                    name: name.toLowerCase(),
                    camelName: utils.toCamelName(name),
                    localDir: this.productModulesDir + '/' + name.toLowerCase(),
                    pkg: this.productModulesPkg,
                    version: this.product.version
                }
            );
        });
        console.log(identifier + '产品模块:' + productModuleNames);
        console.log();

        return {
            resourceModules: resourceModules,
            serviceModules: serviceModules,
            templetModules: templetModules,
            libModules: libModules,
            componentModules: componentModules,
            funcModules: funcModules,
            productResourceModules: productResourceModules,
            productComponentModules: productComponentModules,
            productModules: productModules
        };

        /**
         * 获取当前模板对应的所有模块名字
         * @param {any} curTemplet 
         * @returns 
         */
        function getTempletModuleNames(curTemplet) {
            for (const value of config.templet.templets) {
                if (value[0] === curTemplet) {
                    return value[1]
                }
            }
        }
    }
}
module.exports = config;