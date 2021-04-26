import electron, { App, BrowserWindow } from 'electron'
import type { IDbType } from '../db/index'

/**
 * 基类封装
 */
export default class BaseController {
  db: IDbType = global.db // 数据库
  app: App = electron.app // electron app

  /**
   * 获取活动窗口
   */
  getBrowserWindow () {
    const windows = BrowserWindow.getAllWindows()
    return windows[0]
  }

  setWebMsg (type: string, data: any) {
    const win = this.getBrowserWindow()
    if (!win) {
      throw new Error('活跃窗口不存在， 请确认')
    }
    win.webContents.send(type, data)
  }
}
