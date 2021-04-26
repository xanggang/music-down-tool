import BaseController from '@/electorn/controller/base'
import { Ipc } from '@/electorn/router/decorator'
import * as IpcEnums from '@/electorn/ipc/enums'
import { IpcMainEvent } from 'electron'

export default class DownFileController extends BaseController {

  @Ipc(IpcEnums.V_DOWN_FILE)
  downFile (event: IpcMainEvent, path?: string) {
    if (!path) return
    const webContents = this.getWebContents()
    webContents.downloadURL(path)
    event.returnValue = 'success'
  }
}
