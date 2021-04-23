import { dialog, ipcMain, OpenDialogSyncOptions, IpcMainEvent, BrowserWindow } from 'electron'
import * as IpcEnums from './enums'
import { getDirFiles } from '../fileUtil'

export default class IpcApp {
  win: BrowserWindow

  constructor (app: BrowserWindow) {
    this.win = app
    this.init()
  }

  init () {
    this.onShowSavePathDiaLog()
    this.onSendSysConfig()
    this.onGetDirFile()
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

  // 主进程推送相关配置
  changeSysConfig () {
    this.win.webContents.send(IpcEnums.M_CHANG_SYS_SETTING, global.db.get('sysConfig').value())
  }

  // 渲染进程主动获取相关配置
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

  //
  onGetDirFile () {
    function handle (event: IpcMainEvent, path?: string) {
      if (!path) return
      const fileList = getDirFiles('.mp3', path)
      event.returnValue = fileList
    }

    ipcMain.on(IpcEnums.R_GET_DIR_FILE_LIST, handle)
  }
}
