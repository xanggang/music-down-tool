import fs from 'fs-extra'
import Datastore from 'nedb'
import path from 'path'
import type { IDownItemOptions } from '@/types/downTypes1'

export default class DownListDb {
  data: Nedb<IDownItemOptions>

  constructor () {
    const bastDir = global.userBasePath
    if (!fs.pathExistsSync(bastDir)) { // 如果不存在路径
      fs.mkdirpSync(bastDir) // 就创建
    }

    this.data = new Datastore({
      filename: path.join(bastDir, '/downList.json'),
      autoload: true
    })

    this.cancelAllDownItem()
  }

  /**
   * 更新下载状态
   */
  updateDownItemStatus (uuid: string, state: string, downItemInfo?: IDownItemOptions) {
    if (downItemInfo) {
      this.data.update({ uuid: uuid }, downItemInfo)
      return
    }
    const updateQuery: any = {
      $set: {
        state
      }
    }
    this.data.update({ uuid: uuid }, updateQuery)
  }

  /**
   * 下载列表
   */
  getDownList (): Promise<IDownItemOptions[]> {
    return new Promise((resolve, reject) => {
      this.data.find({}, (err: Error | null, docs: IDownItemOptions[]) => {
        if (err) reject(err)
        else resolve(docs)
      })
    })
  }

  /**
   * 添加一条下载记录
   */
  insertDownItem (downItem: IDownItemOptions) {
    return new Promise((resolve, reject) => {
      this.data.insert(downItem, (err: Error | null, docs) => {
        if (err) reject(err)
        resolve(docs)
      })
    })
  }

  /**
   * 删除全部下载记录
   * 不删除正在下载的和等待下载的
   */
  deleteAllDownItem () {
    return new Promise((resolve, reject) => {
      const query = {
        state: { $in: ['completed', 'cancelled', 'interrupted'] }
      }
      this.data.remove(query, { multi: true }, (err: Error | null, docs) => {
        if (err) reject(err)
        resolve(docs)
      })
    })
  }

  /**
   * 删除一个下载任务
   * @param uuid
   */
  deleteDownItem (uuid: string) {
    return new Promise((resolve, reject) => {
      const query = { uuid }
      this.data.remove(query, { multi: true }, (err: Error | null, docs) => {
        if (err) reject(err)
        resolve(docs)
      })
    })
  }

  /**
   * 取消全部下载
   */
  cancelAllDownItem () {
    const query = {
      state: { $in: ['waitdown', 'progressing'] }
    }
    const updateQuery = {
      $set: {
        state: 'cancelled'
      }
    }
    this.data.update(query, updateQuery, { multi: true })
  }

  /**
   * 获取全部的下载记录
   */
  getAllDownItem () {
    return new Promise((resolve, reject) => {
      this.data.find({}, (err: Error | null, docs: IDownItemOptions[]) => {
        if (err) reject(err)
        resolve(docs)
      })
    })
  }
}
