import path from 'path'
import { DownloadItem } from 'electron'
import BaseController from '@/electorn/controller/base'
import type { IDownQueueItem, IProgressParType, IDownItemInfoType } from '@/types/downTypes'

// 转换数据大小格式
const bytesToSize = (bytes: number, decimals?: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1000
  const dm = decimals || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

interface IDownInfoMap {
  [key: string]: DownloadItem;
}

export class DownLoadManagerClass extends BaseController {
  queue: IDownQueueItem[] = []
  downInfoMap: IDownInfoMap = {}

  constructor (ctx: any) {
    super(ctx)
    this.registerDownLoadListener()
  }

  /**
   * 监听electron的下载事件，
   * @private
   */
  private registerDownLoadListener () {
    console.log('\x1b[42;30m 注册下载管理器 \x1B[0m')
    const webContents = this.getWebContents()
    const listener = (e: Event, item: DownloadItem) => {
      const itemUrl = decodeURIComponent(item.getURLChain()[0] || item.getURL())
      const queueItem = this.popQueueItem(itemUrl)
      const filePath = path.join(queueItem.downloadFolder, queueItem.path, queueItem.fileName)
      item.setSavePath(filePath)
      this.downInfoMap[queueItem.uuid] = item

      // 当前下载任务的总字节数
      const totalBytes = item.getTotalBytes()
      let receivedBytes = 0

      item.on('updated', (event: Event, state: any) => {
        const currentReceivedBytes = item.getReceivedBytes() // 已经下载的字节数
        const speedValue = currentReceivedBytes - receivedBytes // 上次-这次=速度
        receivedBytes = currentReceivedBytes // 记录
        const progress: IProgressParType = {
          uuid: queueItem.uuid,
          progress: receivedBytes * 100 / totalBytes, // 进度
          speedBytes: speedValue, // 速度
          speed: bytesToSize(speedValue) + '/sec', // 速度
          remainingBytes: totalBytes - receivedBytes, // 剩余
          remaining: bytesToSize(totalBytes - receivedBytes),
          totalBytes: totalBytes, // 全部
          total: bytesToSize(totalBytes),
          downloadedBytes: receivedBytes, // 已下载
          downloaded: bytesToSize(receivedBytes)
        }
        const downInfo: IDownItemInfoType = {
          canResume: item.canResume(),
          uuid: queueItem.uuid,
          savePath: item.getSavePath(), // 保存路径
          downURL: item.getURL(), // 下载地址
          mimeType: item.getMimeType(), // MIME 类型
          hasUserGesture: item.hasUserGesture(), // 是否具有用户手势
          fileName: item.getFilename(), // 下载文件名
          contentDisposition: item.getContentDisposition(), // 响应头中的Content-Disposition字段
          startTime: item.getStartTime(), // 开始下载时间
          isUserPause: false,
          state
        }
        queueItem.onProgress(progress, downInfo)
      })

      item.on('done', async (e: any, state: any) => {
        queueItem.onFinishedDownload({
          uuid: queueItem.uuid,
          url: item.getURL(),
          filePath,
          state
        })
        delete this.downInfoMap[queueItem.uuid]
      })
    }
    webContents.session.on('will-download', listener)
  }

  /**
   * 从下载队列取出一个下载任务
   * @param url
   */
  popQueueItem (url: string) {
    const index = this.queue.findIndex(item => item.url === url)
    const queueItem = this.queue.splice(index, 1)
    if (queueItem.length) return queueItem[0]
    else throw new Error(`下载队列错误，${url}不在下载队列中`)
  }

  /**
   * 添加一个下载任务
   * @param option
   */
  addDownLoadTask (option: any) {
    const webContents = this.getWebContents()
    this.queue.push(option)
    webContents.downloadURL(option.url)
  }

  /**
   * 暂停下载
   * @param uuid
   */
  onNeedPause (uuid: string) {
    const downloadItem = this.downInfoMap[uuid]
    if (!downloadItem) throw new Error(`暂停下载失败，${uuid}不存在`)
    if (!downloadItem.isPaused()) downloadItem.pause()
    return true
  }

  /**
   * @description 接收到恢复命令
   * @param uuid
   */
  onNeedResume (uuid: string) {
    const downloadItem = this.downInfoMap[uuid]

    if (!downloadItem || !downloadItem.canResume()) {
      throw new Error(`恢复下载失败，${uuid}不存在或者不可恢复`)
    }
    downloadItem.resume()
    return true
  }

  /**
   * @description 删除下载任务
   * @param uuid
   */
  onNeedDelete (uuid: string) {
    try {
      const downloadItem = this.downInfoMap[uuid]
      if (downloadItem) {
        delete this.downInfoMap[uuid]
      }
      return true
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * @description 接收到取消命令
   * @param uuid
   */
  onNeedCancel (uuid: string) {
    const downloadItem = this.downInfoMap[uuid]

    if (!downloadItem) {
      throw new Error(`恢复下载失败，${uuid}不存在`)
    }

    downloadItem.cancel()
    delete this.downInfoMap[uuid]
    return true
  }
}

function getDownLoadManager (): (ctx: any) => DownLoadManagerClass {
  let downLoadManager: DownLoadManagerClass | null = null
  return (ctx: any) => {
    if (downLoadManager) return downLoadManager
    downLoadManager = new DownLoadManagerClass(ctx)
    return downLoadManager
  }
}

export default getDownLoadManager()
