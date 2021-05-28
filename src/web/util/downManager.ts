import * as DownApi from '@/web/api/down'
import { v4 as uuidv4 } from 'uuid'
import * as fileUtils from '@/web/util/fileUtil'
import { message } from 'ant-design-vue'
import { ref, Ref, toRaw } from 'vue'
import type { IDownFinishedCallBackPar, IDownItemOptions } from '@/types/downTypes1'
import Api from '@/electorn/enums/ApiEnums'

const { ipcRenderer } = window.require('electron')

interface IDownItemMap {
  [key: string]: IDownItemOptions;
}

export class WebDownManager {
  waitDownloadList: Ref<IDownItemOptions[]> = ref([])
  downloadState: Ref<IDownItemMap> = ref({})// 正在下载中的
  downHistoryList: Ref<IDownItemOptions[]> = ref([]) // 下载完成的和历史记录
  maxCount = 1 // 下载并发数量

  constructor () {
    this.addEventListener()
  }

  /**
   * 添加下载相关的事件监听
   */
  addEventListener () {
    ipcRenderer.on(Api.DownFileApi.M_DOWN_PROGRESS, (e: any, data: any) => {
      this.onDownProgress(data)
    })
    ipcRenderer.on(Api.DownFileApi.M_DOWN_SUCCESS, (e: any, data: any) => {
      this.onDownSuccess(data)
    })
  }

  /**
   * 筛选出正在下载的item, 包括暂停的
   */
  private getDowningList () {
    return Object.values(this.downloadState.value).filter(item => {
      return item.state === 'progressing'
    })
  }

  /**
   * 向任务队列添加一个任务
   * @param url
   */
  handleAddDownFileTask (url: string) {
    const { ext, name } = fileUtils.getFileNameTool(url)
    const queueItem: IDownItemOptions = {
      uuid: uuidv4(),
      state: 'waitdown',
      url: url,
      path: 'electronDown',
      fileName: name + ext,
      downFileName: '',
      savePath: '', // 保存路径
      downURL: '', // 下载地址
      isUserPause: false, // 是否暂停状态
      canResume: false, // 是否可以继续下载
      progressInfo: {}
    }
    this.waitDownloadList.value.push(queueItem)
  }

  /**
   * 批量添加下载任务
   * @param fileList
   */
  handleBatchAddDownFileTask (fileList: string[]) {
    fileList.forEach((file) => {
      this.handleAddDownFileTask(file)
    })
  }

  /**
   * 限流下载
   */
  private limitDownCount () {
    const maxCount = this.maxCount
    const downLength = this.getDowningList().length
    const downNum = maxCount - downLength
    if (downNum <= 0) return
    const list = this.waitDownloadList.value.splice(0, downNum)
    list.forEach((queueItem) => {
      const res = ipcRenderer.sendSync(Api.DownFileApi.V_DOWN_FILE, toRaw(queueItem))
      if (res === 'failed') {
        console.log('添加下载任务失败')
        return
      }
      this.downloadState.value[queueItem.uuid] = queueItem
    })
  }

  /**
   * 暂停下载
   * @param uuid
   */
  handleDownPause (uuid: string) {
    const res = ipcRenderer.sendSync(Api.DownFileApi.V_PAUSE_DOWN, uuid)
    if (res !== 'success') message.error(res)
  }

  /**
   * 恢复下载
   * @param uuid
   */
  handleDownResume (uuid: string) {
    const res = ipcRenderer.sendSync(Api.DownFileApi.V_RESUME_DOWN, uuid)
    if (res !== 'success') message.error(res)
  }

  /**
   * 删除正在下载的
   * @param uuid
   */
  handleDownDelete (uuid: string) {
    const res = ipcRenderer.sendSync(Api.DownFileApi.V_DELETE_DOWN, uuid)
    if (res !== 'success') return message.error(res)
    delete this.downloadState.value[uuid]
  }

  /**
   * 删除历史记录 todo: promise
   */
  handleDeleteHistory (uuid: string) {
    const res = ipcRenderer.sendSync(Api.DownFileApi.V_DELETE_DOWN, uuid)
    if (res !== 'success') return message.error(res)
    const index = this.downHistoryList.value.findIndex(item => item.uuid === uuid)
    if (index < 0) return
    this.downHistoryList.value.splice(index, 1)
  }

  /**
   * 取消下载
   * @param uuid
   */
  handleDownCancel (uuid: string) {
    const res = ipcRenderer.sendSync(Api.DownFileApi.V_CANCEL_DOWN, uuid)
    if (res !== 'success') return message.error(res)
  }

  /**
   * 暂停全部
   */
  handlePauseAll () {
    const res: string[] | 'failed' = ipcRenderer.sendSync(Api.DownFileApi.V_PAUSE_ALL)
    if (res === 'failed') message.error('全部暂停操作失败')
  }

  /**
   * 取消全部下载 todo promise
   */
  async handleClearAll () {
    const res = await DownApi.handleClearAll()
    if (!res) return message.error('清除失败')
  }

  /**
   * 同步下载历史
   */
  async handleGetDownHistoryList () {
    const res: any = await DownApi.handleGetDownHistoryList()
    if (!res) return message.error('查询失败')
    this.downHistoryList.value = res
  }

  /**
   * 下载完成
   * @param data
   */
  onDownSuccess (data: IDownFinishedCallBackPar) {
    const queueItem = this.downloadState.value[data.uuid]
    if (!queueItem) throw new Error('进度条更新失败，下载的文件不在队列中')
    const icon = ipcRenderer.sendSync(Api.ToolApi.V_GET_FILE_ICON, queueItem.savePath)
    queueItem.state = data.state
    queueItem.icon = icon
    this.downHistoryList.value.push(queueItem)
    delete this.downloadState.value[data.uuid]
    this.limitDownCount()
    console.log('下载完成')
  }

  /**
   * 下载进度条
   */
  onDownProgress (data: IDownItemOptions) {
    const uuid = data.uuid
    this.downloadState.value[uuid] = data
  }

  testDown () {
    // const a = 'https://freetyst.nf.migu.cn/public/product9th/product42/2021/01/2612/2009年06月26日博尔普斯/歌曲下载/MP3_40_16_Stero/60054701938124543.mp3?key=49979f81e373c100&Tim=1619349468395&channelid=00&msisdn=e5582e73d8eb4ee2a1cee25e508c6ebb&CI=600547019382600902000006889306&F=000009'
    // const c = 'https://cloud-dev.cdn-qn.hzmantu.com/upload_dev/2020/06/17/ljlYFjMmWelwE0Jc-Ts6m-OUJEV3.jpg'

    // const b = 'https://cloud-dev.cdn-qn.hzmantu.com/upload_dev/2021/04/21/lr2fd1oOvlUlyMH3C0woCEXba27M.jpg'
    // const d = 'https://cloud-dev.cdn-qn.hzmantu.com/upload_dev/2020/06/17/lkLb5AfrSqhmamZTsZ_XqzFDnSdv.jpg'
    const d = 'https://download.jetbrains.com.cn/webstorm/WebStorm-2021.1.1.dmg'
    // const e = 'http://m701.music.126.net/20210511180820/520024b402e3943bfc2aaf19729b1b47/jdyyaac/0509/0158/065e/2c9b88ed8362529464e214ad79aeed7c.m4a'

    this.handleBatchAddDownFileTask([d])
  }
}

function getDownLoadManager (): () => WebDownManager {
  let manager: WebDownManager | null = null
  return () => {
    if (manager) return manager
    manager = new WebDownManager()
    return manager
  }
}

export default getDownLoadManager()
