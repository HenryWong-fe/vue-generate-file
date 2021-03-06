#! /usr/bin/env node

const program = require('commander');
const generateViewPage = require('../generate/generateViewPage.js')
const generateGlobalComponent = require('../generate/generateGlobalComponent.js')

program
    .version(require('../package').version, '-v, --version')
    .description(require('../package').description)
    
program
    .option("-p, --Page","页面级组件创建初始化", generateViewPage)
    .option("-c, --Component","全局组件创建初始化", generateGlobalComponent)

    // 根据命令行 选择是否创建页面级组件还是全局组件
Program.on('--help', function(){
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('  $  --help');
    console.log('  $ g-file g');
    console.log('  $ g-file g -c');
    console.log('  $ g-file g -p');
});

Program.parse(process.argv);

// 如用户未输入任何命令
(function help () {
    if (program.args.length < 1) return program.help();
})()