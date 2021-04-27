import BaseController from '@/electorn/controller/base'
import { Ipc } from '@/electorn/router/decorator'
import * as IpcEnums from '@/electorn/ipc/enums'
import { IpcMainEvent } from 'electron'

import type { IDownOptions, IProgressParType, IDownQueueType } from '@/types/downTypes'

export default class DownFileController extends BaseController {
  @Ipc(IpcEnums.V_DOWN_FILE)
  downFile (event: IpcMainEvent, options: IDownOptions) {
    const downloadFolder = options.downloadFolder || this.db.get('downloadFolder').value()
    const item: IDownQueueType = {
      uuid: '12333',
      url: options.url,
      path: 'electornDown',
      filename: '测试下载文件.mp3',
      downloadFolder,
      onProgress: (par: IProgressParType) => {
        console.log('onProgress', { par })
        this.setWebMsg(IpcEnums.M_DOWN_PROGRESS, par)
      },
      onFinishedDownload: (par: any) => {
        this.setWebMsg(IpcEnums.M_DOWN_SUCCESS, par)
      }
    }
    this.ctx.downLoadManager.addDownLoadTask(item)
    event.returnValue = 'success'
  }
}
