import BaseController from '@/electorn/controller/base'
import { dialog, IpcMainEvent, OpenDialogSyncOptions } from 'electron'
import { Ipc } from '@/electorn/router/decorator'
import Api from '@/electorn/ipc/enums'
import FileUtil from '@/electorn/util/fileUtil'
import DialogUtil from '@/electorn/util/dialogUtil'
/**
 * 系统配置相关
 */
export default class ConfigController extends BaseController {
  /**
   * 获取一个文件夹的路径
   * @param event
   */
  @Ipc(Api.ToolApi.V_SAVE_PATH_DIALOG)
  showSavePathDiaLog (event: IpcMainEvent) {
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
  }

  /**
   * 获取系统设置渲染进程主动获取相关配置
   * @param event
   */
  @Ipc(Api.ConfigApi.V_CHANG_SYS_SETTING)
  onSendSysConfig (event: IpcMainEvent) {
    const config = global.db.get('sysConfig').value()
    event.returnValue = config
    this.setWebMsg(Api.ConfigApi.M_CHANG_SYS_SETTING, config)
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
