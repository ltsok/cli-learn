const identifier = '[publish]';
const config = require('../common/config.js')
const utils = require('../common/utils.js');
const func = require('../common/func.js');

var publish = {
    onPublish: function (input) {

        // 加载全局配置
        config.default();

        if (input && input.length > 0) {

            // 发布指定模块
            func.excute(input, (module) => doPublish(module.localDir));

        } else {

            // 发布waf所有模块
            func.getWafPkg().forEach((pkg) => func.excute(pkg, (module) => doPublish(module.localDir)));

            // 发布waf模板框架
            config.templet.templets.forEach((element) => {
                doPublish(config.templetDir + '/' + element[0]);

                 // 取消发布其他模板中的模块
                 if (config.curTemplet !== element[0]) {
                    element[1].forEach((moduleName) => {
                        doPublish(config.localCode + config.templet.dir + '/' + element[0] + '/modules/' + moduleName)
                    });
                }
            });
        }

        /**
         * 发布操作
         * @param {any} dir 
         */
        function doPublish(dir) {

            try {
                utils.runCmd('npm publish', dir);
                console.log(identifier + '发布成功:' + dir);
            } catch (error) {
                console.error(identifier + '发布失败' + dir + ':');
                console.error(error);
                throw new Error(error);
            }
        }

    },

    onUnPublish: function (input) {

        // 加载全局配置
        config.default();

        if (input && input.length > 0) {

            // 取消发布指定模块
            func.excute(input, (module) => doUnpublish(module.pkg + '/' + module.name + '@' + module.version));

        } else {

            // 取消发布waf所有模块
            func.getWafPkg().forEach((pkg) => func.excute(pkg, (module) => doUnpublish(module.pkg + '/' + module.name + '@' + module.version)));

            // 取消发布waf模板框架
            config.templet.templets.forEach((element) => {
                doUnpublish(config.templetPkg + '/' + element[0] + '@' + config.templet.version);

                // 取消发布其他模板中的模块
                if (config.curTemplet !== element[0]) {
                    element[1].forEach((moduleName) => {
                        doUnpublish('@' + element[0] + '/' + moduleName + '@' + config.templet.version)
                    });
                }
            });
        }

        /**
         * 取消发布操作
         * @param {any} coordinate 
         */
        function doUnpublish(coordinate) {

            try {
                utils.runCmd('npm unpublish ' + coordinate);
                console.log(identifier + '取消发布成功:' + coordinate);
            } catch (error) {
                console.error(identifier + '取消发布失败' + coordinate + ':');
                console.error(error);
                throw new Error(error);
            }
        }
    }
};
module.exports = publish;