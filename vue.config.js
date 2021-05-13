/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: true, // eslint 错误处理，true表示对待eslint错误为warnings，warnings不会导致编译失败
  pages: {
    index: {
      entry: 'src/web/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  configureWebpack: () => {
    const config = {
      resolve: {
        alias: {
          web: resolve('src/web'),
          main: resolve('src/electorn'),
          types: resolve('src/types')
        }
      }
    }
    return config
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/background.ts', // 主进程入口
      mainProcessWatch: ['src/electorn'], // 检测主进程文件变化时候重新编译

      customFileProtocol: 'launcher://./',
      nodeModulesPath: ['./node_modules']
    }
  }
}
