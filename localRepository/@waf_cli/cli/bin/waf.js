#!/usr/bin/env node
const PKG = require('../package.json');

const program = require('commander');
const init = require('./init/init.js');
const install = require('./install/install.js');
const update = require('./update/update.js');
const build = require('./build/build.js');
const query = require('./query/query.js');
const gen = require('./gen/gen.js');
const publish = require('./publish/publish.js');
const select = require('./select/select.js');

program
    .version(PKG.name + " " + PKG.version);

program
    .command('init')
    .description('初始化waf本地环境')
    .action(init.onInit);

program
    .command('reinit')
    .description('刷新waf本地环境')
    .action(init.onReInit);

program
    .command('install')
    .description('安装waf本地环境')
    .action(install.onInstall);

program
    .command('update')
    .option('-c, --cover', '更新waf全部模块')
    .option('-w, --waf', '更新waf全部模块')
    .option('-p, --waf_pkg', '更新waf模块包')
    .option('-m, --waf_mod', '更新waf模块')
    .option('-r, --waf_rep', '更新waf本地环境')
    .arguments('[modulePkg/modules...]')
    .description('更新模块包/模块(多个模块以空格分割)')
    .action(update.onUpdate);

program
    .command('upgrade')
    .description('升级waf')
    .action(update.onUpgrade);

program
    .command('ls')
    .arguments('[product]')
    .description('查看产品信息')
    .action(query.onLs);

program
    .command('use')
    .arguments('<product>')
    .description('切换选中产品')
    .action(select.onUse);

program
    .command('build')
    .arguments('<project>')
    .description('构建应用')
    .action(build.onBuild);

program
    .command('serve')
    .arguments('[port]')
    .description('运行应用')
    .action(build.onServe);

program
    .command('new')
    .option('-w, --waf', '新建waf模块')
    .arguments('<module>')
    .description('创建模块')
    .action(gen.onNewModule);

program
    .command('page')
    .arguments('<page>')
    .description('创建页面')
    .action(gen.onNewPage);

program
    .command('publish')
    .arguments('[modules...]')
    .description('发布模块')
    .action(publish.onPublish);

program
    .command('unpublish')
    .arguments('[modules...]')
    .description('取消发布模块')
    .action(publish.onUnPublish);

program
    .parse(process.argv);