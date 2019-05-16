const fs = require('fs')

function mkdirs (directory, callback) {
  var exists = fs.existsSync(directory)
  if (exists) {
    callback()
  } else {
    mkdirs(path.dirname(directory), function () {
      fs.mkdirSync(directory)
      callback()
    })
  }
}
module.exports = {
  dotExistDirectoryCreate: function (directory) {
    return new Promise((resolve) => {
      mkdirs(directory, function () {
        resolve(true)
      })
    })
  },
  generateFile: function (path, data) {
    // 判断是否存在该文件
    if (fs.existsSync(path)) {
      throw new Error({
        message: `${path}文件已存在`
      })
    }
    return new Promise((resolve, reject) => {
      fs.writeFileSync(path, data, 'utf8', err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }
}