import BaseController from '@/electorn/controller/base'
import { IpcMainEvent } from 'electron'
import { Ipc } from '@/electorn/router/decorator'
import Api from '@/electorn/ipc/enums'
import FileUtil from '@/electorn/util/fileUtil'
import DialogUtil from '@/electorn/util/dialogUtil'

export default class PlayListController extends BaseController {
  /**
   * 递归扫描一个文件夹， 获取音乐相关的播放列表
   */
  @Ipc(Api.PlayListApi.V_SCANNING_FOLDER_START)
  async getPlayListByFolder (event: IpcMainEvent) {
    const folderPath = DialogUtil.getFolderPath()
    if (!folderPath) {
      event.returnValue = folderPath
      event.sender.send(Api.PlayListApi.V_SCANNING_FOLDER_END, [])
      return
    }
    console.time('读取文件信息耗时')
    const list = await FileUtil.deepReadDir(['.mp3'], folderPath)
    console.timeEnd('读取文件信息耗时')
    event.sender.send(Api.PlayListApi.V_SCANNING_FOLDER_END, list)
  }
}
