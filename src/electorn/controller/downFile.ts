import { IpcMainEvent, shell } from 'electron'
import fs from 'fs'
import BaseController from '@/electorn/controller/base'
import { Ipc } from '@/electorn/router/decorator'
import * as IpcEnums from '@/electorn/ipc/enums'

import type { IDownOptions, IDownQueueType } from '@/types/downTypes'

export default class DownFileController extends BaseController {
  @Ipc(IpcEnums.V_DOWN_FILE)
  downFile (event: IpcMainEvent, options: IDownOptions) {
    const downloadFolder = options.downloadFolder || this.db.get('downloadFolder').value()
    const item: IDownQueueType = {
      uuid: options.uuid,
      url: options.url,
      path: 'electornDown',
      filename: options.fileName,
      downloadFolder,
      onProgress: (process, itemInfo) => {
        console.log('onProgress', { process })
        this.setWebMsg(IpcEnums.M_DOWN_PROGRESS, { itemInfo, process })
      },
      onFinishedDownload: (par: any) => {
        this.setWebMsg(IpcEnums.M_DOWN_SUCCESS, par)
      }
    }
    this.ctx.downLoadManager.addDownLoadTask(item)
    event.returnValue = 'success'
  }

  @Ipc(IpcEnums.V_GET_FILE_ICON)
  async getFileIcon (event: IpcMainEvent, path: string) {
    try {
      const nativeImage = await this.app.getFileIcon(path)
      event.returnValue = nativeImage.toDataURL() // 使用base64展示图标
    } catch {
      event.returnValue = ''
    }
  }

  @Ipc(IpcEnums.V_OPEN_FOLDER)
  async openFolder (event: IpcMainEvent, path: string) {
    try {
      if (!fs.existsSync(path)) { // 文件不存在
        return false
      }
      shell.showItemInFolder(path) // 打开文件所在文件夹
    } catch {
      event.returnValue = 'failed'
    }
  }
}
