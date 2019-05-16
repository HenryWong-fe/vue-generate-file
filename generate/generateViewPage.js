const chalk = require('chalk')
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')

const resolve = (...file) =>  path.resolve(__dirname, ...file)
const log = message => console.log(chalk.white(`${message}`))
const successLog = message => console.log(chalk.green(`${message}`))
const errorLog = message => console.log(chalk.red(`${message}`))
const { pageTemplate }  = require('../template') 
const { dotExistDirectoryCreate, generateFile} = require('../util')

const promptList = [
  {
    name: "keepAlive",
    type: "confirm",
    message: `当前页面是否需要持久化存储?`,
    default: false
  },
  {
    name: "viewTitle",
    type: "input",
    message: `请输入当前页面的页面标题`,
    default: ''
  },
  {
    name: "componentName",
    type: "input",
    message: `请输入要创建的页面组件名称`,
    validate: function(val) {
      let done = this.async()
      if(!val) done("请输入组件名称")
      if(!val.match(/^[a-zA-Z]+$/)) done('请输入正确格式的组件名称')
      return done(null, true)
    }
  }
]
let componentName = ''
module.exports = inquirer.prompt(promptList).then(async promptData => {
  let {componentName: inputName, viewTitle: viewTitle, keepAlive: keepAlive} = promptData
  console.log(inputName, viewTitle, keepAlive)
  let componentFileName = resolve('../src/views', inputName)
  if (!componentName.endsWith('.vue')) {
    componentFileName += '.vue'
  }
  const componentDir = path.dirname(componentFileName)
  const componentIsExists = fs.existsSync(componentFileName)
  // 1.生成页面文件
  // 2.生成路由文件
  // 3.生成接口文件
  if (componentIsExists) {
    errorLog(`${inputName}页面组件已存在,请重新输入`)
    return
  } else {
    log(`正在为您生成组件目录 ${componentDir}`)
    await dotExistDirectoryCreate(componentDir)
  }
  try {
    if (inputName.includes('/')) {
      const inputArr = inputName.split('/')
      componentName = inputArr[inputArr.length - 1]
    } else {
      componentName = inputName
    }
    log(`正在生成 vue 文件 ${componentFileName}`)
    await generateFile(componentFileName, pageTemplate(componentName))
    successLog('生成成功')
  } catch (e) {
    errorLog(e.message)
  }
  log(componentName); // 返回的结果
})
