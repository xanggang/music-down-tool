import path from 'path'
import electron, { BrowserWindow, DownloadItem } from 'electron'
import fs from 'fs'
import BaseController from '@/electorn/controller/base'
import type { IDownQueueType } from '@/types/downTypes'

// 转换数据大小格式
const bytesToSize = (bytes: number, decimals?: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1000
  const dm = decimals || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export class DownLoadManagerClass extends BaseController {
  // 下载路径
  downloadFolder: string = global.db.get('downloadFolder').value()
  queue: IDownQueueType[] = []

  constructor (ctx: any) {
    super(ctx)
    console.log('DownLoadManagerClass', 'constructor')
    this.registerDownLoadListener()
  }

  /**
   * 监听electron的下载事件，
   * @private
   */
  private registerDownLoadListener () {
    const webContents = this.getWebContents()
    const listener = (e: Event, item: DownloadItem) => {
      const itemUrl = decodeURIComponent(item.getURLChain()[0] || item.getURL())
      const queueItem = this.popQueueItem(itemUrl)
      const filePath = path.join(queueItem.downloadFolder, queueItem.path, queueItem.filename)
      item.setSavePath(filePath)

      // 当前下载任务的总字节数
      const totalBytes = item.getTotalBytes()
      let receivedBytes = 0

      item.on('updated', (event: Event, state: any) => {
        const currentReceivedBytes = item.getReceivedBytes() // 已经下载的字节数
        const speedValue = currentReceivedBytes - receivedBytes // 上次-这次=速度
        receivedBytes = currentReceivedBytes // 记录
        const progress = {
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
        queueItem.onProgress(progress)
      })

      item.on('done', (e: any, state: any) => {
        console.log('文件下载完成', state)
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
    // const item: IDownQueueType = {
    //   uuid: '12333',
    //   url: option.url,
    //   path: 'electornDown',
    //   filename: '测试下载文件.mp3',
    //   downloadFolder: option.downloadFolder || this.db.get('downloadFolder').value()
    //   // onProgress: () => {},
    //   // callback: () => {}
    // }
    this.queue.push(option)
    webContents.downloadURL(option.url)
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
