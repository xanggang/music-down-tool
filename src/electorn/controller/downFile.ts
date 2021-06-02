import { IpcMainEvent, shell } from 'electron'
import fs from 'fs'
import BaseController from '@/electorn/controller/base'
import { Ipc } from '@/electorn/router/decorator'
import Api from '@/electorn/enums/ApiEnums'

import type { IDownQueueItem, IDownItemOptions } from '@/types/downTypes'

export default class DownFileController extends BaseController {
  /**
   * 开始一个下载记录
   */
  @Ipc(Api.DownFileApi.V_DOWN_FILE)
  async downFile (event: IpcMainEvent, options: IDownItemOptions) {
    console.log('添加下载任务', options)
    const downloadFolder = options.downloadFolder || await this.db.getDownloadFolder()
    const item: IDownQueueItem = {
      ...options,
      downloadFolder,
      onProgress: (storeDownItem: IDownItemOptions) => {
        this.setWebMsg(Api.DownFileApi.M_DOWN_PROGRESS, storeDownItem)
      },
      onFinishedDownload: (par: any) => {
        this.setWebMsg(Api.DownFileApi.M_DOWN_SUCCESS, par)
      }
    }
    this.ctx.downLoadManager.addDownLoadTask(item)
    event.returnValue = 'success'
  }

  /**
   * 获取文件图标
   */
  @Ipc(Api.ToolApi.V_GET_FILE_ICON)
  async getFileIcon (event: IpcMainEvent, path: string) {
    try {
      const nativeImage = await this.app.getFileIcon(path)
      event.returnValue = nativeImage.toDataURL() // 使用base64展示图标
    } catch {
      event.returnValue = ''
    }
  }

  /**
   * 暂停一个项目
   */
  @Ipc(Api.DownFileApi.V_PAUSE_DOWN)
  async handlePause (event: IpcMainEvent, uuid: string) {
    try {
      const res = this.ctx.downLoadManager.onNeedPause(uuid)
      if (res) event.returnValue = 'success'
    } catch (error) {
      event.returnValue = error.message
    }
  }

  /**
   * 恢复一个项目
   */
  @Ipc(Api.DownFileApi.V_RESUME_DOWN)
  async handleResume (event: IpcMainEvent, uuid: string) {
    try {
      const res = this.ctx.downLoadManager.onNeedResume(uuid)
      if (res) event.returnValue = 'success'
    } catch (error) {
      event.returnValue = error.message
    }
  }

  /**
   * 取消一个项目
   */
  @Ipc(Api.DownFileApi.V_CANCEL_DOWN)
  async handleCancel (event: IpcMainEvent, uuid: string) {
    try {
      const res = this.ctx.downLoadManager.onNeedCancel(uuid)
      if (res) event.returnValue = 'success'
    } catch (error) {
      event.returnValue = error.message
    }
  }

  /**
   * 删除历史记录
   */
  @Ipc(Api.DownFileApi.V_DELETE_DOWN_HISTORY)
  async handleDeleteHistory (event: IpcMainEvent, uuid: string) {
    try {
      const res = await this.db.downList.deleteDownItem(uuid)
      if (res) event.returnValue = 'success'
    } catch (error) {
      event.returnValue = error.message
    }
  }

  /**
   * 打开指定文件夹
   */
  @Ipc(Api.ToolApi.V_OPEN_FOLDER)
  async openFolder (event: IpcMainEvent, path: string) {
    try {
      if (!fs.existsSync(path)) { // 文件不存在
        return false
      }
      shell.showItemInFolder(path) // 打开文件所在文件夹
      event.returnValue = 'success'
    } catch {
      event.returnValue = 'failed'
    }
  }

  /**
   * 暂停全部项目
   */
  @Ipc(Api.DownFileApi.V_PAUSE_ALL)
  async handlePauseAll (event: IpcMainEvent) {
    try {
      const uuidList = this.ctx.downLoadManager.onPauseAll()
      event.returnValue = uuidList || []
    } catch {
      event.returnValue = 'failed'
    }
  }

  /**
   * 清除下载记录
   */
  @Ipc(Api.DownFileApi.V_CLEAR_ALL_START)
  async handleClearAll (event: IpcMainEvent) {
    try {
      await this.ctx.downLoadManager.onClearAll()
      event.sender.send(Api.DownFileApi.V_CLEAR_ALL_END, true)
    } catch (err) {
      console.error(err)
      event.sender.send(Api.DownFileApi.V_CLEAR_ALL_END, false)
    }
  }

  /**
   * 取消全部任务
   */
  @Ipc(Api.DownFileApi.V_CANCEL_ALL)
  async handleCancelAll (event: IpcMainEvent) {
    try {
      this.ctx.downLoadManager.onCancelAll()
      event.returnValue = 'success'
    } catch (err) {
      event.returnValue = 'failed'
    }
  }

  /**
   * 获取下载记录
   */
  @Ipc(Api.DownFileApi.V_GET_DOWN_LIST_START)
  async handleGetDownHistoryList (event: IpcMainEvent) {
    try {
      const res = await this.ctx.downLoadManager.onGetDownHistoryList()
      event.sender.send(Api.DownFileApi.V_GET_DOWN_LIST_END, res)
    } catch (err) {
      console.error(err)
      event.sender.send(Api.DownFileApi.V_GET_DOWN_LIST_END, [])
    }
  }
}
