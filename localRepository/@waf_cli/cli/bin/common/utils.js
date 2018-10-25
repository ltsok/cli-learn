const colors = require('colors');
const fs = require('fs-extra');
const identifier = '[utils]';

var utils = {

    /**
     * 运行本地命令
     * @param {any} cmd 
     * @param {any} cmdDir 
     * @returns 
     */
    runCmd: function (cmd, cmdDir) {

        const childProcess = require('child_process');
        childProcess.execSync(cmd, { cwd: cmdDir, encoding: 'utf-8' });
    },

    /**
     * 渲染ftl模板
     * @param {any} dir 
     * @param {any} ftl 
     * @param {any} data 
     * @returns 
     */
    renderFile: function (dir, ftl, data) {

        let template = require('art-template');
        return template(dir + ftl, data);
    },

    /**
     * 获取所有直接子目录
     * @param {any} parentDir 
     * @returns 
     */
    getDirectChildDirs: function (parentDir) {

        let directChildDirs = [];
        try {

            fs.readdirSync(parentDir).forEach((ele, index) => {
                let info = fs.statSync(parentDir + "/" + ele);
                if (info.isDirectory()) {
                    directChildDirs.push(ele);
                }
            });
        } catch (error) {
            console.log(identifier + '请检查此目录是否存在：' + parentDir);
            return directChildDirs;
        }
        return directChildDirs;
    },


    /**
     * 获取目录下所有直接子文件
     * @param {any} parentDir 
     * @returns 
     */
    getDirectChildFiles: function (parentDir) {

        let directChildFiles = [];
        try {

            fs.readdirSync(parentDir).forEach((ele, index) => {
                let info = fs.statSync(parentDir + "/" + ele);
                if (info.isFile()) {
                    directChildFiles.push(ele);
                }
            });
        } catch (error) {
            console.log(identifier + '请检查此目录是否存在：' + parentDir);
            return directChildFiles;
        }
        return directChildFiles;
    },


    /**
     * 判断元素是否在数组内
     * @param {any} arr 
     * @param {any} obj 
     * @returns 
     */
    contains: function (arr, obj) {
        if (!arr) {
            return false;
        }
        let i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    },

    /**
     * 命令行表格
     * @param {any} input 
     */
    cliTable: function (input) {

        // 确保widths和titles的长度是一样的，否则报错
        if (input.widths.length < input.titles.length) {

            throw new Error('宽度值个数和表格头个数不匹配');
        }

        // 引入包
        const cliFormat = require('cli-format');

        // 空一行
        console.log();

        // 表头
        let fistLine = [];
        let titleWidths = [];
        input.titles.forEach((title, index) => {
            titleWidths[index] = input.widths[index] === 'auto' ? title.length * 2 : input.widths[index];
            fistLine.push({
                content: title.bgBlue.bold,
                width: titleWidths[index]
            });
        });
        console.log(cliFormat.columns.wrap(fistLine, { paddingMiddle: ' -- '.bold }));

        // 表记录
        input.contents.forEach((content) => {

            let line = [];
            content.forEach((field, index) => {
                line.push({
                    content: field,
                    width: titleWidths[index]
                });
            });
            console.log(cliFormat.columns.wrap(line, { paddingMiddle: ' -- ' }));
        });

        // 空一行
        console.log();
    },

    /**
     * 获取当前时间，格式yyyyMMddHHmmss
     * @returns 
     */
    getCurDate: function () {
        let date = new Date();
        return date.getFullYear()
            + compensate(date.getMonth() + 1)
            + compensate(date.getDate())
            + compensate(date.getHours())
            + compensate(date.getMinutes())
            + compensate(date.getSeconds());

        function compensate(val) {

            if (val >= 0 && val <= 9) {
                return "0" + val;
            }
            return val;
        }
    },

    /**
     * 将模块的名字按照"_"(默认)分割后转换成驼峰形式
     * @param {any} input 
     * @param {any} separator 
     * @returns 
     */
    toCamelName: function (input, separator) {

        if (!separator) {
            separator = '_';
        }

        let names = input.toLowerCase().split(separator);;
        for (let i = 0; i < names.length; i++) {
            names[i] = names[i][0].toUpperCase() + names[i].substring(1, names[i].length);
        }
        return names.join("");
    },

    /**
     * 将模块的名字按照"_"(默认)分割后转换成"-"分割
     * 主要用于骨架中文件名的前缀
     * @param {any} input 
     * @param {any} separator 
     * @returns 
     */
    toFilePrefix: function (input, separator) {
        return input.replace(/_/g, "-");
    },

    /**
    * 将模块的名字按照"_"分割后转换成"."分割
    * 主要用于国际化key
    * @param {any} input 
    * @returns 
    */
    toI18nKey: function (input) {
        return input.replace(/_/g, ".");
    },

    /**
     * 判断字符串结尾
     * @param {any} str 
     * @param {any} endStr 
     * @returns 
     */
    endWith: function (str, endStr) {
        let d = str.length - endStr.length;
        return (d >= 0 && str.lastIndexOf(endStr) == d);
    },

    /**
     * 将某个目录打成zip包
     * @param {any} srcDir 
     * @param {any} zipPath 
     */
    zip: function (srcDir, zipPath) {

        const AdmZip = require('adm-zip');
        let zip = new AdmZip();
        zip.addLocalFolder(srcDir);
        zip.writeZip(zipPath);
    },

    /**
     * 交互式命令
     * @param {any} name 
     * @param {any} steps 
     * @param {any} callback 
     */
    interCmd: function (name, steps, callback) {

        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let flowIdentifier = '[' + name + '] ';

        // 第0步：确认是否要进入交互流程
        rl.setPrompt(flowIdentifier + "是否确认进入" + name + "流程(y|n) > ");
        rl.prompt();

        // 初始化当前步骤
        let curStep = 0;
        let curStepInfo;

        // 初始化交互获取的对象
        let obj = [];

        // 是否允许进入下一步
        let flag = true;

        // 开始交互
        rl.on('line', (line) => {

            let info = line.trim();

            // 处理第0步的输入
            // 输入n表示退出，否则表示进入
            if (0 === curStep && info && 'n' === info) {
                rl.close();
            }

            // 处理输入
            // 如果有合法输入，则设置到交互对象并允许下一步操作
            // 如果没有合法输入并且是必输项，则再次提示，不允许下一步操作
            // 如果没有合法输入，也不是必输项，则设置默认值到交互对象
            if (0 < curStep) {
                if (info) {

                    obj[curStepInfo.name] = info;
                    flag = true;
                    if ('selection' === curStepInfo.type && !utils.contains(curStepInfo.options, info)) {
                        console.log(flowIdentifier + '[错误] 请输入正确的选项!');
                        rl.prompt();
                        flag = false;
                    }

                } else if (curStepInfo && (curStepInfo.require || 'selection' === curStepInfo.type)) {
                    console.log(flowIdentifier + '[错误] 选项必须输入!');
                    rl.prompt();
                    flag = false;
                } else {
                    obj[curStepInfo.name] = curStepInfo.default;
                    flag = true;
                }

                // 根据类型进行必要的数据转换
                if ('list' === curStepInfo.type) {
                    let list = obj[curStepInfo.name];
                    if (list) {
                        obj[curStepInfo.name] = list.split(",");
                    } else {
                        obj[curStepInfo.name] = [];
                    }
                }
            }

            if (flag) {

                // 判断是否完成所有步骤
                if (curStep > steps.length - 1) {

                    // 输入交互对象，进行流程逻辑
                    console.log(flowIdentifier + '参数对象:');
                    console.log(obj);
                    console.log();
                    callback(obj);

                    // 关闭交互流程
                    rl.close();
                }

                // 进入下一步
                curStep++;
                curStepInfo = steps[curStep - 1];

                if (!curStepInfo.type || 'string' === curStepInfo.type || 'list' === curStepInfo.type) {

                    if (curStepInfo.require) {
                        rl.setPrompt(flowIdentifier + curStepInfo.prompt + '(必填) > ');
                    } else if (curStepInfo.default) {
                        rl.setPrompt(flowIdentifier + curStepInfo.prompt + '(' + curStepInfo.default + ') > ');
                    } else {
                        rl.setPrompt(flowIdentifier + curStepInfo.prompt + ' > ');
                    }

                } else if ('selection' === curStepInfo.type) {

                    if (curStepInfo.options && curStepInfo.options.length > 0) {
                        rl.setPrompt(flowIdentifier + curStepInfo.prompt + '(' + curStepInfo.options.join("|") + ') > ');
                    } else {
                        throw new Error('请为下拉项定义选项：' + curStepInfo.name);
                    }
                } 
                rl.prompt();
            }
        }).on('close', () => {
            process.exit(0);
        });
    }
};
module.exports = utils;