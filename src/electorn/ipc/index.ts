import { dialog, ipcMain, OpenDialogSyncOptions, IpcMainEvent, BrowserWindow } from 'electron'
import * as IpcEnums from './enums1'

export default class IpcApp {
  win: BrowserWindow

  constructor (app: BrowserWindow) {
    this.win = app
    this.init()
  }

  init () {
    this.showSavePathDiaLog()
  }

  showSavePathDiaLog () {
    // 显示保存弹框
    function showSavePathDiaLog (event: IpcMainEvent) {
      console.log('showSavePathDiaLog')
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

    ipcMain.on(IpcEnums.SAVE_PATH_DIALOG, showSavePathDiaLog)
  }
}
