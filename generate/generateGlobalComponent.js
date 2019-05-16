const chalk = require('chalk')
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const ora = require('ora')
const spinner = ora({
  text: chalk.blue('开始生成模板文件')
});

const resolve = (...file) =>  path.resolve(__dirname, ...file)
const log = message => console.log(chalk.white(`${message}`))
const successLog = message => console.log(chalk.green(`${message}`))
const errorLog = message => console.log(chalk.red(`${message}`))
const { pageTemplate, entryComponentTemplate }  = require('./template') 
const { dotExistDirectoryCreate, generateFile} = require('../util')

const promptList = [
  {
    name: "isGlobalComponent",
    type: "confirm",
    message: `是否需要创建一个全局组件`,
    default: false
  },
  {
    name: "componentName",
    type: "input",
    message: `请输入要创建的组件名称`,
    validate: function(val) {
      let done = this.async()
      if(!val) done("请输入组件名称")
      if(!val.match(/^[a-zA-Z]+$/)) done('请输入正确格式的组件名称')
      return done(null, true)
    }
  }
]

let componentName = ''

inquirer.prompt(promptList).then(promptData => {
  spinner.start('开始创建文件, 请稍等......');
  const isGlobalComponent = promptData.isGlobalComponent
  const inputName = promptData.componentName
  // 组件文件夹路径
  const componentDirPath = resolve('../src/components', inputName)
  // 组件文件路径
  const componentPath = resolve(componentDir, `${inputName}.vue`)
  // 入口文件路径
  const entryPath = resolve(componentDir, 'index.js')
  // 组件文件夹是否存在
  const componentDirIsExist = fs.existsSync(componentDirPath)
  if (componentDirIsExist) {
    spinner.fail(chalk.red(`${inputName}组件目录已存在,请重新输入一个组件名`));
    return 
  } else {
    spinner.info(`正在生成 component 目录 ${componentDirPath}`)
    await dotExistDirectoryCreate(componentDirPath) 
  }
  try {
    if (inputName.includes('/')) {
      const inputArr = inputName.split('/')
      componentName = inputArr[inputArr.length - 1]
    } else {
      componentName = inputName
    }
    spinner.info(`正在生成 vue 文件 ${componentPath}`)
    await generateFile(componentPath, pageTemplate(componentName))
    spinner.info(`正在生成 entry 文件 ${entryPath}`)
    await generateFile(entryPath, entryComponentTemplate)
    spinner.succeed('文件生成成功')
  } catch (e) {
    spinner.fail(chalk.red(e.message));
  }
})