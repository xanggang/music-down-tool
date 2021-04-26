const fs = require('fs-extra')
const path = require('path')

const basePath = './downMisic/data'

/**
 * 获取文件夹
 * @param musicName
 * @returns {string}
 */
function getBasePath (musicName) {
  return path.join(basePath, musicName)
}
/**
 * 获取写入文件夹
 * @param musicName
 * @returns {string}
 */
function mkWriteFilePath (musicName) {
  try {
    const resPath = getBasePath(musicName)
    fs.ensureDirSync(resPath)
    return resPath
  } catch (err) {
    console.log(err)
    throw new Error('创建文件夹失败， fun:' + getWriteFilePath)
  }
}

function writeFile () {

}

module.exports = {
  getBasePath,
  mkWriteFilePath
}
