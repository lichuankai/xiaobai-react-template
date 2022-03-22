// const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const inquirer = require('inquirer');

const pathResolve = (...file) => path.resolve(__dirname, ...file);
// const log = message => console.log(chalk.green(`${message}`));
// const successLog = message => console.log(chalk.blue(`${message}`));
// const errorLog = message => console.log(chalk.red(`${message}`));
const log = message => console.log(message);
const errorLog = message => console.log(message);

// 创建文件
function generateFile(path, data = '') {
  if (fs.existsSync(path)) {
    errorLog(`${path}文件已存在`)
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => {
      console.log('查看经过了嘛')
      if (err) {
        errorLog(err.message)
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

// 递归创建目录
function mkdirs(directory, callback) {
  const exists = fs.existsSync(directory);
  if (exists) {
    callback();
  } else {
    mkdirs(path.dirname(directory), () => {
      fs.mkdirSync(directory);
      callback();
    })
  }
}

// 创建文件夹
function doExistDirectoryCreate(directory) {
  return new Promise(resolve => {
    mkdirs(directory, () => {
      resolve()
    })
  })
}

const initInquirer = () => {
  const promptList = [{
    type: 'list',
    message: '请选择一个项目：',
    name: 'project',
    default: 'blocks-erp',
    choices: ['blocks-erp', 'blocks-basic-data'],
    filter: (val) => val.toLowerCase()
  }, {
    type: 'input',
    message: '请填写页面文件名称',
    name: 'name',
  }]

  inquirer.prompt(promptList).then((answers) => {
    console.log(answers, '返回结果');
    /**   * 文件目录路径   */
    const projectDirectory = pathResolve(`../src/${answers.project}`, answers.name) // 生成目录放在src下  
    const hasProjectDirectory = fs.existsSync(projectDirectory);
    if (hasProjectDirectory) {
      // 判断目录是否存在
      console.log(`${answers.name}项目目录已经存在，请重新输入`);
    } else {
      log(`正在生成文件目录`);
      doExistDirectoryCreate(pathResolve(projectDirectory));// 创建文件夹
      
      ejs.renderFile(pathResolve('templates/index.ejs'), { name: 'Index' }, async(err, data) => {
        if (err) {
          console.log(err);
        } else {
          await generateFile(pathResolve(projectDirectory, 'index.tsx'), data);
          log('文件生成成功')
        }
      })
    }
  })
}

initInquirer();