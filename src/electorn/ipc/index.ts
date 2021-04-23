import { dialog, ipcMain, OpenDialogSyncOptions, IpcMainEvent, BrowserWindow } from 'electron'
import * as IpcEnums from './enums'

export default class IpcApp {
  win: BrowserWindow

  constructor (app: BrowserWindow) {
    this.win = app
    this.init()
  }

  init () {
    this.onShowSavePathDiaLog()
    this.onSendSysConfig()
  }

  onShowSavePathDiaLog () {
    // 显示保存弹框
    function showSavePathDiaLog (event: IpcMainEvent) {
      const options = {
        title: '选择保存路径',
        defaultPath: '',
        buttonLabel: '确认',
        properties: ['openDirectory', 'createDirectory', 'promptToCreate']
      }
      const request = dialog.showOpenDialogSync(options as OpenDialogSyncOptions)
      if (request) {
        event.returnValue = request
      } else {
        event.returnValue = ''
      }
      console.log(request)
    }

    ipcMain.on(IpcEnums.R_SAVE_PATH_DIALOG, showSavePathDiaLog)
  }

  changeSysConfig () {
    this.win.webContents.send(IpcEnums.M_CHANG_SYS_SETTING, global.db.get('sysConfig').value())
  }

  onSendSysConfig () {
    ipcMain.on(IpcEnums.R_CHANG_SYS_SETTING, (event: IpcMainEvent) => {
      const config = global.db.get('sysConfig').value()
      event.returnValue = config
      try {
        this.changeSysConfig()
      } catch (err) {
        console.log(err)
      }
    })
  }
}
