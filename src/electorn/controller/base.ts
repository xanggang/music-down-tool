import electron, { App, BrowserWindow } from 'electron'
import type { IDbType } from '@/types/db'
import type { IcpContentxType } from '@/types/icpContentxType'

/**
 * 基类封装
 */
export default class BaseController {
  db: IDbType = global.db // 数据库
  app: App = electron.app // electron app
  ctx: IcpContentxType
  constructor (ctx: IcpContentxType) {
    this.ctx = ctx
  }

  /**
   * 获取活动窗口
   */
  getBrowserWindow () {
    const windows = BrowserWindow.getAllWindows()
    return windows[0]
  }

  /**
   * 获取WebContents
   */
  getWebContents () {
    const win = this.getBrowserWindow()
    if (!win) {
      throw new Error('活跃窗口不存在， 请确认')
    }
    return win.webContents
  }

  setWebMsg (type: string, data: any) {
    const win = this.getBrowserWindow()
    if (!win) {
      throw new Error('活跃窗口不存在， 请确认')
    }
    win.webContents.send(type, data)
  }
}
