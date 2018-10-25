const identifier = '[gen]';
const fs = require('fs-extra');
const utils = require('../common/utils.js');
const config = require('../common/config.js');
const func = require('../common/func.js');
const skeletonDir = __dirname + '/skeleton';

var gen = {

    onNewModule: function (input, cmd) {

        // 加载全局配置
        config.default();

        if (cmd.waf) {

            // 定义初始化步骤
            let steps = [
                { name: 'pkg', prompt: '请输入所属模块包', type: 'selection', options: ['waf_service', 'waf_component', 'waf_templet', 'waf_func'] }
            ];

            // 执行交互命令
            utils.interCmd("新建WAF模块", steps, (obj) => doNewModule(obj.pkg, input));

        } else {

            // 定义初始化步骤
            let steps = [
                { name: 'pkg', prompt: '', type: 'selection', options: ['prod', 'prod_component'] }
            ];

            // 执行交互命令
            utils.interCmd("新建产品模块", steps, (obj) => doNewModule(obj.pkg, input));
        }

        /**
         * 新建模块
         * @param {any} modulePkg 
         * @param {any} moduleName 
         */
        function doNewModule(modulePkg, moduleName) {

            try {
                let newModuleInfo = getNewModuleInfo(modulePkg);

                // 替换对象
                let data = {
                    module: {
                        pkg: newModuleInfo.pkg,
                        name: moduleName,
                        prefix: utils.toFilePrefix(moduleName),
                        i18n: utils.toI18nKey(moduleName),
                        menuId: utils.getCurDate(),
                        camelName: utils.toCamelName(moduleName),
                        version: newModuleInfo.version
                    }
                };

                // 根据配置替换生成文件
                const mappingCfg = getMappingCfg(modulePkg);
                mappingCfg.mapping.forEach((mappingItem) => {

                    let destFile = newModuleInfo.dir + '/' + moduleName + mappingItem.ddir + '/' + mappingItem.dest.replace(/\{\{module.name\}\}/g, utils.toFilePrefix(moduleName));
                    let result = utils.renderFile(skeletonDir + mappingItem.sdir, "/" + mappingItem.src, data)
                    fs.outputFileSync(destFile, result);
                    console.log(identifier + '新建模块文件成功：' + moduleName + ':' + destFile);
                });

            } catch (error) {
                console.error(identifier + '创建模块失败:' + moduleName);
                console.error(error);
                throw new Error(error);
            }
        }

        /**
         * 获取响应的模块包配置
         * @param {any} modulePkg 
         * @returns 
         */
        function getMappingCfg(modulePkg) {

            // 获取文件模板映射信息
            const skeletonCfg = require(skeletonDir + '/conf/skeleton.json');

            // 匹配对应的映射
            let mappingCfgName = '';
            skeletonCfg.mappings.forEach((mappingCfg) => {

                if (mappingCfg.key === modulePkg) {
                    mappingCfgName = mappingCfg.value;
                }
            });

            // 没有匹配的映射则报错提醒
            if ('' === mappingCfgName) {
                throw new Error('模块包没有对应的映射:' + modulePkg);
            }

            return require(skeletonDir + '/conf/' + mappingCfgName + '.json');
        }

        /**
        * 根据模块包获取新建模块的信息
        * @param {any} input 
        */
        function getNewModuleInfo(input) {

            if ('waf_service' === input) {

                return {
                    version: config.service.version,
                    dir: config.serviceDir,
                    pkg: config.servicePkg
                }

            } else if ('waf_component' === input) {

                return {
                    version: config.component.version,
                    dir: config.componentDir + config.component.widget.dir,
                    pkg: config.componentPkg
                }

            } else if ('waf_templet' === input) {

                return {
                    version: config.templet.version,
                    dir: config.curModulesDir,
                    pkg: config.curModulesPkg
                }

            } else if ('waf_func' === input) {

                return {
                    version: config.func.version,
                    dir: config.funcDir,
                    pkg: config.funcPkg
                }

            } else if ('prod' === input) {

                return {
                    version: config.product.version,
                    dir: config.productModulesDir,
                    pkg: config.productModulesPkg
                }

            } else if ('prod_component' === input) {

                return {
                    version: config.product.version,
                    dir: config.productComponentDir,
                    pkg: config.productComponentPkg
                }

            } else {
                throw new Error('无此模块包:' + input);
            }
        }
    },

    onNewPage: function (input) {

        // 加载全局配置
        config.default();

        // 定义初始化步骤
        let selection = [];
        config.moduleData.productModules.forEach((productModule) => {
            selection.push(productModule.name);
        });

        let steps = [
            { name: 'moduleName', prompt: '选择模块', type: 'selection', options: selection },
            { name: 'pagePath', prompt: '输入路径(相对路径)', default: '' }
        ];

        // 执行交互命令
        utils.interCmd("新建页面", steps, (obj) => doNewPage(obj, input));

        function doNewPage(obj, pageName) {

            let moduleName = obj.moduleName;
            let pagePath = obj.pagePath.trim().replace(/\\/g, '/');

            // 整理输入的路径
            if (pagePath && !pagePath.startsWith('/')) {
                pagePath = "/" + pagePath;
            }

            try {
                let pageMapping = require(skeletonDir + '/conf/page.json');

                let data = {
                    module: {
                        name: moduleName,
                        prefix: utils.toFilePrefix(moduleName),
                        camelName: utils.toCamelName(moduleName)
                    },
                    page: {
                        name: pageName,
                        prefix: utils.toFilePrefix(pageName),
                        camelName: utils.toCamelName(pageName, '-')
                    }
                };

                pageMapping.mapping.forEach((mappingItem) => {

                    let destFile = config.productModulesDir + '/'
                        + moduleName
                        + mappingItem.ddir.replace(/\{\{page.path\}\}/g, pagePath).replace(/\{\{page.name\}\}/g, utils.toFilePrefix(pageName))
                        + '/' + mappingItem.dest.replace(/\{\{page.name\}\}/g, utils.toFilePrefix(pageName));

                    let result = utils.renderFile(skeletonDir + mappingItem.sdir, "/" + mappingItem.src, data)
                    fs.outputFileSync(destFile, result);
                    console.log(identifier + '新建页面文件成功：' + moduleName + ':' + destFile);
                });
            } catch (error) {
                console.error(identifier + '创建模块失败:' + moduleName);
                console.error(error);
                throw new Error(error);
            }
        }
    }


};
module.exports = gen;