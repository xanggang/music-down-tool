'use strict'
import { app, protocol } from 'electron'
import ElectronApp from './electorn/index'

global.env = process.env.NODE_ENV || 'dev'
global.isDevelopment = global.env !== 'production' // 是否是开发模式
global.userDir = app.getPath('userData') // 获取用户地址路径
global.launcherStaticDir = __static // 启动器静态文件地址
global.staticDir = __static // 全局静态文件地址

console.log(`cache dir: ${global.userDir}`)

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true }}
])

app.on('ready', async () => {
  new ElectronApp().loadApp()
})
