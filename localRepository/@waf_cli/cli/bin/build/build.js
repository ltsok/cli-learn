const identifier = '[build]';
const fs = require('fs-extra');
const xlsx = require('node-xlsx').default;
const utils = require('../common/utils.js');
const config = require('../common/config.js');

// 构建模块
var build = {

    onBuild: function (input) {

        config.default();

        console.log(identifier + '开始构建应用:' + config.product.name);
        build.doit('ng build --prod');
        console.log(identifier + '编译成功');

        let curDate = utils.getCurDate();
        let distDir = config.product.dist + '/' + curDate;
        fs.ensureDirSync(distDir);

        let runZip = distDir + "/" + config.product.name + "_" + input + "_run_" + curDate + ".zip";
        let runSrc = config.frameworkDir + '/dist'
        utils.zip(runSrc, runZip);
        console.log(identifier + '运行包打包成功:' + runZip);

        let srcZip = distDir + "/" + config.product.name + "_" + input + "_src_" + curDate + ".zip";
        let srcSrc = config.product.localCode;
        utils.zip(srcSrc, srcZip);
        console.log(identifier + '源码包打包成功:' + srcZip);

        let depZip = distDir + "/" + config.product.name + "_" + input + "_dependencies_" + curDate + ".zip";
        let depSrc = config.frameworkDir + "/node_modules";
        utils.zip(depSrc, depZip);
        console.log(identifier + '依赖包打包成功:' + depZip);

        console.log(identifier + '应用构建成功:' + config.product.name);
    },

    onServe: function (input) {

        config.default();

        // 没有输入端口就默认4200
        if (!input) {
            input = 4200;
        }

        console.log(identifier + '应用启动:' + config.product.name);
        build.doit('start ng serve --port ' + input);
    },

    doit: function (cmd) {

        try {

            // 拷贝资源
            copyAssets();

            // 生成index.html文件
            genIndex();

            // 生成全局样式文件
            genGlobalScsses();

            // 生成全局主题样式文件并拷贝
            genThemes();

            //  生成国际化文件
            genI18n();

            utils.runCmd(cmd, config.frameworkDir);

        } catch (error) {

            console.error(identifier + '应用构建/运行失败:');
            console.error(error);
            throw new Error(error);
        }

        /**
         * 拷贝资源
         */
        function copyAssets() {

            // 删除资源目录
            let dest = config.frameworkDir + "/src/assets/";
            fs.removeSync(dest);

            // 拷贝各模块中的资源
            let data = config.moduleData;
            for (let key in data) {
                data[key].forEach(element => {
                    let src = config.frameworkDir + "/node_modules/" + element.pkg + "/" + element.name + "/src/assets"
                    if (fs.pathExistsSync(src)) {
                        fs.copySync(src, dest);
                        console.log(identifier + '资源拷贝成功:' + element.name + ' -- ' + src + ' -- ' + dest);
                    } else {
                        console.log(identifier + '无资源拷贝:' + element.name);
                    }
                });
            }
        }

        /**
         * 生成主题文件
         */
        function genThemes() {

            // 主题相关基准目录
            let dest_themes_dir = config.frameworkDir + "/src/assets/themes";
            let src_themes_dir = config.frameworkDir + "/node_modules/" + config.resourcePkg + "/theme/themes";
            let cmd_dir = config.frameworkDir + "/node_modules/.bin"

            // 获取所有的主题
            utils.getDirectChildDirs(src_themes_dir).forEach((dirName) => {

                console.log(identifier + "生成主题：" + dirName);

                // 当前待生成主题的原宿目录
                let cur_src_themes_dir = src_themes_dir + '/' + dirName;
                let cur_dest_themes_dir = dest_themes_dir + '/' + dirName;
                fs.ensureDirSync(cur_dest_themes_dir);
                utils.getDirectChildFiles(cur_src_themes_dir).forEach((fileName) => {

                    if (utils.endWith(fileName, '.scss')) {

                        let src = cur_src_themes_dir + '/' + fileName;
                        let dest = cur_dest_themes_dir + '/' + fileName.replace(/.scss/, '.css');
                        let scss_cmd = 'node-sass --output-style compressed ' + src + ' > ' + dest;
                        utils.runCmd(scss_cmd, cmd_dir);
                        console.log(identifier + "生成主题文件：" + src + ' -- ' + dest);

                    } else if (utils.endWith(fileName, '.less')) {

                        let src = cur_src_themes_dir + '/' + fileName;
                        let dest = cur_dest_themes_dir + '/' + fileName.replace(/.less/, '.css');
                        let less_cmd = 'lessc ' + src + ' > ' + dest;
                        utils.runCmd(less_cmd, cmd_dir);
                        console.log(identifier + "生成主题文件：" + src + ' -- ' + dest);

                    } else if (utils.endWith(fileName, '.css')) {
                        let src = cur_src_themes_dir + '/' + fileName;
                        let dest = cur_dest_themes_dir + '/' + fileName;
                        fs.copySync(src, dest);
                        console.log(identifier + "拷贝主题文件：" + src + ' -- ' + dest);

                    } else {
                        console.log(identifier + "无效文件：" + fileName);
                    }
                });
            });
        }

        /**
         * 生成index.html文件
         */
        function genIndex() {

            let index_html = config.frameworkDir + '/src/index.html';
            let index_ftl = '/src/ftl/index.ftl';

            let result = utils.renderFile(config.frameworkDir, index_ftl, { customization: config.product.customization });
            fs.chmodSync(index_html, '777');
            fs.outputFileSync(index_html, result);
            console.log(identifier + 'index.html创建成功:' + index_html);
        }

        /**
         * 判断模块中是否存在全局样式文件
         */
        function isHaveGlobalScss(pkg, name) {

            let file = config.frameworkDir + '/node_modules/' + pkg + '/' + name + "/src/scss/global.scss";
            if (fs.pathExistsSync(file)) {
                console.log(identifier + '待导入的全局SCSS文件:' + file);
                return true;
            } else {
                return false;
            }
        }

        /**
         * 生成全局样式文件
         */
        function genGlobalScsses() {

            let data = config.moduleData;
            for (let key in data) {
                data[key].forEach(element => {
                    element.isHaveGlobalScss = isHaveGlobalScss(element.pkg, element.name);
                });
            }

            let globalStyle_scss = config.frameworkDir + '/src/styles.scss';
            let globalStyle_ftl = '/src/ftl/styles.ftl';

            let result = utils.renderFile(config.frameworkDir, globalStyle_ftl, data);
            fs.chmodSync(globalStyle_scss, '777');
            fs.outputFileSync(globalStyle_scss, result);
            console.log(identifier + '全局样式创建成功:' + globalStyle_scss);
        }

        /**
         * 生成国际化文件
         */
        function genI18n() {

            // 1.获取waf框架、产品国际化excel文件信息
            let i18nFiles = [];
            let waf_i18nFile = config.frameworkDir + "/node_modules/@waf_resource/i18n/i18n_waf.xlsx";
            if (!fs.existsSync(waf_i18nFile)) {
                throw new Error("WAF国际化文件不存在:" + waf_i18nFile);
            }
            i18nFiles.push(waf_i18nFile);

            let product_i18nFile = config.frameworkDir + '/node_modules/' + config.productResourcePkg + '/i18n/i18n.xlsx';
            if (!fs.existsSync(product_i18nFile)) {
                throw new Error("产品国际化文件不存在:" + product_i18nFile);
            }
            i18nFiles.push(product_i18nFile);

            // 2.解析国际化excel文件, 返回语言与国际化信息的json信息
            let retLanguage2allData = genI18nFile(i18nFiles);

            // 3.根据语言类型生成对应的json国际化文件
            let langs = [];
            for (let language in retLanguage2allData) {
                let json = config.frameworkDir + '/src/assets/i18n/' + language + '.json';
                fs.outputJSONSync(json, retLanguage2allData[language]);
                langs.push(language);
                console.log(identifier + language + "国际化文件成功:" + json);
            }

            // 4.追加当前支持的语言类型
            let appCfg = config.frameworkDir + "/src/assets/conf/config.json";
            if (fs.existsSync(appCfg)) {

                // 读取应用全局配置
                let obj = fs.readJsonSync(appCfg);

                // 判断是否是否已经有语言类型配置
                let flag = false;
                obj.config.forEach((data) => {
                    if ('langs' === data.key) {
                        flag = true;
                    }
                });

                if (!flag) {

                    // 添加语言类型配置
                    obj.config.push({ key: 'langs', value: langs });

                    // 覆盖原配置文件
                    fs.chmodSync(appCfg, '777');
                    fs.outputFileSync(appCfg, JSON.stringify(obj, null, 2));
                }
            }
        }

        function genI18nFile(i18nFiles) {

            let language2allData = {};//国际化文件中根据语言类型对应的所有国际化信息
            let languageArray = [];//文件支持的语言类型列表
            let all_key = [];//用于保存文件中的所有key，避免冲突

            i18nFiles.forEach(file => {

                const workSheetsFromFile = xlsx.parse(file);

                // 根据excel，获取第三个sheet页：菜单sheet页中的第一行得到所有语言类型
                let menuSheet = workSheetsFromFile[3];
                let sheetRowData = menuSheet.data;
                sheetRowData[0].forEach(colName => {
                    if (colName.indexOf("词条名_") != -1) {
                        let language = colName.slice(colName.indexOf("_") + 1);
                        languageArray.push(language);
                    }
                });

                // 目前支持的sheet页包含'菜单', '词条_common', '词条_component', '词条_templet'
                workSheetsFromFile.forEach(sheet => {
                    if (sheet.name == "菜单") {
                        let data = sheet.data;
                        // 首先清除掉空行数据
                        for (let i = 0; i < data.length; i++) {
                            if (data[i] == "" || data[i] == null) {
                                data.splice(i, 1);
                                i = i - 1;
                            }
                        }
                        // 将第一行与其他行区别开
                        let firstRow = data.splice(0, 1)[0];
                        let otherRows = data;
                        let module_index, key_index, currentLanguageValueIndex;

                        languageArray.forEach(language => {
                            let keyValuePair = {};
                            for (let i = 0; i < firstRow.length; i++) {
                                if (firstRow[i] == '所属模块') {
                                    module_index = i;
                                } else if (firstRow[i] == '菜单名') {
                                    key_index = i;
                                }
                                if (utils.endWith(firstRow[i], language)) {
                                    currentLanguageValueIndex = i;
                                }

                            }

                            // 根据'所属模块'字段及当前支持的模块信息过滤后，将'菜单名'、当前language值所在列添加至对应的国际化数组中
                            otherRows.forEach(eachRowData => {
                                let moduleName = eachRowData[module_index];
                                let key = eachRowData[key_index];
                                let value = eachRowData[currentLanguageValueIndex];

                                if (keyValuePair[key]) {
                                    if (utils.contains(all_key, key)) {
                                        console.warn(identifier + "国际化词条重复:" + key);
                                    } else {
                                        all_key.push(key);
                                    }
                                } else {
                                    keyValuePair[key] = value;
                                }
                            });

                            // 追加新增的keyvalue至对应语言类型json数据中
                            let allData = language2allData[language];
                            if (allData) {
                                for (let key in keyValuePair) {

                                    allData[key] = keyValuePair[key];
                                }
                            } else {
                                language2allData[language] = keyValuePair;
                            }

                        })

                    } else if (sheet.name == "词条_common" || sheet.name == "词条_component"
                        || sheet.name == "词条_templet" || sheet.name == "词条_func" || sheet.name == "词条") {

                        let data = sheet.data;
                        // 首先清除掉空行数据
                        for (let i = 0; i < data.length; i++) {
                            if (data[i] == "" || data[i] == null) {
                                data.splice(i, 1);
                                i = i - 1;
                            }
                        }

                        // 将第一行与其他行区别开
                        let firstRow = data.splice(0, 1)[0];
                        let otherRows = data;
                        let key_index, currentLanguageValueIndex;
                        languageArray.forEach(language => {

                            let keyValuePair = {};

                            // 根据第一行中'词条名'、'词条名_zh'、'词条名_en'的位置解析其他行数组
                            for (let i = 0; i < firstRow.length; i++) {
                                if (firstRow[i] == '词条名') {
                                    key_index = i;
                                }
                                if (utils.endWith(firstRow[i], language)) {
                                    currentLanguageValueIndex = i;
                                }
                            }

                            // 将'词条名'、'词条名_zh'、'词条名_en'添加至对应的国际化数组中
                            otherRows.forEach(eachRowData => {
                                let key = eachRowData[key_index];
                                let value = eachRowData[currentLanguageValueIndex];

                                if (keyValuePair[key]) {
                                    if (utils.contains(all_key, key)) {
                                        console.warn(identifier + "国际化词条重复:" + key);
                                    } else {
                                        all_key.push(key);
                                    }
                                } else {
                                    keyValuePair[key] = value;
                                }
                            });

                            // 追加新增的keyvalue至对应语言类型json数据中
                            let allData = language2allData[language];
                            if (allData) {
                                for (let key in keyValuePair) {

                                    allData[key] = keyValuePair[key];
                                }
                            } else {
                                language2allData[language] = keyValuePair;
                            }
                        })
                    }

                })
            })
            return language2allData;
        }
    }
};
module.exports = build;