import { IDown } from '@/types/db'
import fs from 'fs-extra'
import Datastore from 'nedb'
import path from 'path'
import { IDownItemInfoType } from '@/types/downTypes'

export default class DownListDb {
  data: Nedb<IDown>

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
  updateDownItemStatus (uuid: string, state: string, downItemInfo?: IDownItemInfoType) {
    const updateQuery: any = {
      $set: {
        'option.state': state
      }
    }
    if (downItemInfo) {
      updateQuery.$set.downItemInfo = downItemInfo
    }
    this.data.update({ 'option.uuid': uuid }, updateQuery)
  }

  /**
   * 下载列表
   */
  getDownList (): Promise<IDown[]> {
    return new Promise((resolve, reject) => {
      this.data.find({}, (err: Error | null, docs: IDown[]) => {
        if (err) reject(err)
        else resolve(docs)
      })
    })
  }

  /**
   * 添加一条下载记录
   */
  insertDownItem (downItem: IDown) {
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
        'option.state': { $in: ['completed', 'cancelled', 'interrupted'] }
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
   * 取消全部下载记录
   */
  cancelAllDownItem () {
    const query = {
      'option.state': { $in: ['waitdown', 'progressing'] }
    }
    const updateQuery = {
      $set: {
        'option.state': 'cancelled'
      }
    }
    this.data.update(query, updateQuery, { multi: true })
  }

  /**
   * 获取全部的下载记录
   */
  getAllDownItem () {
    return new Promise((resolve, reject) => {
      this.data.find({}, (err: Error | null, docs: IDown[]) => {
        if (err) reject(err)
        resolve(docs)
      })
    })
  }
}
