'use strict'
import { app, protocol } from 'electron'
import ElectronApp from './electorn/index'
import Db from './electorn/db/index'

global.env = process.env.NODE_ENV || 'dev'
global.isDevelopment = global.env !== 'production' // 是否是开发模式
global.userBasePath = app.getPath('userData') // 获取用户地址路径
global.staticDir = __static // 全局静态文件地址
global.downloadFolder = ''
global.sysConfig = {}
global.db = new Db()

console.log(`cache dir: ${global.userBasePath}`)
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

app.on('ready', async () => {
  new ElectronApp().loadApp()
})
