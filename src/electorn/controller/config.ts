import BaseController from '@/electorn/controller/base'
import { IpcMainEvent } from 'electron'
import { Ipc } from '@/electorn/router/decorator'
import Api from '@/electorn/enums/ApiEnums'
import FileUtil from '@/electorn/util/fileUtil'
import DialogUtil from '@/electorn/util/dialogUtil'
/**
 * 系统配置相关
 */
export default class ConfigController extends BaseController {
  /**
   * 修改下載地址
   * @param event
   */
  @Ipc(Api.ConfigApi.V_CHANGE_DOWN_DIR)
  changeDownloadFolder (event: IpcMainEvent) {
    const request = DialogUtil.getFolderPath()
    if (!request) {
      event.returnValue = ''
      return
    }
    this.db.changeDownloadFolder(request)
    this.setWebMsg(Api.ConfigApi.V_CHANG_SYS_SETTING_END, request)
    event.returnValue = request
  }

  /**
   * 获取一个文件夹的路径
   * @param event
   */
  @Ipc(Api.ToolApi.V_SAVE_PATH_DIALOG)
  showSavePathDiaLog (event: IpcMainEvent) {
    const request = DialogUtil.getFolderPath()
    if (request) {
      event.returnValue = request
    } else {
      event.returnValue = ''
    }
  }

  /**
   * 获取系统设置渲染进程主动获取相关配置
   * @param event
   */
  @Ipc(Api.ConfigApi.V_CHANG_SYS_SETTING_START)
  async onSendSysConfig (event: IpcMainEvent) {
    const config = await this.ctx.db.getDownloadFolder()
    event.sender.send(Api.ConfigApi.V_CHANG_SYS_SETTING_END, config)
  }

  /**
   * 从一个文件夹读取全部的mp3文件
   * @param event
   * @param path
   */
  @Ipc(Api.ToolApi.V_GET_DIR_FILE_LIST)
  onGetDirFile (event: IpcMainEvent, path?: string) {
    if (!path) return
    const fileList = FileUtil.getDirFiles('.mp3', path)
    event.returnValue = fileList
  }

  /**
   * 读取单个文件
   * @param event
   */
  @Ipc(Api.ToolApi.V_OPEN_SINGLE_FILE)
  openSingleFile (event: IpcMainEvent) {
    const path = DialogUtil.getFilePath()
    if (!path) {
      event.returnValue = ''
      return
    }
    const res = FileUtil.readFileAsync(path)
    event.returnValue = res
  }
}
