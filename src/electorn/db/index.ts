import Datastore from 'nedb'
import path from 'path'
import fs from 'fs-extra'
import { app } from 'electron'
import { IDown, IUserConfig } from '@/types/db'

export default class Db {
  userConfig: Nedb<IUserConfig>
  sysConfig: Nedb<any>
  downList: Nedb<IDown>
  playList: Nedb<any[]>

  constructor () {
    const bastDir = global.userBasePath
    if (!fs.pathExistsSync(bastDir)) { // 如果不存在路径
      fs.mkdirpSync(bastDir) // 就创建
    }
    this.userConfig = new Datastore({
      filename: path.join(bastDir, '/userConfig.json'),
      autoload: true
    })
    this.sysConfig = new Datastore({
      filename: path.join(bastDir, '/sysConfig.json'),
      autoload: true
    })
    this.downList = new Datastore({
      filename: path.join(bastDir, '/downList.json'),
      autoload: true
    })
    this.playList = new Datastore({
      filename: path.join(bastDir, '/playList.json'),
      autoload: true
    })

    this.initData()
  }

  initData () {
    this.userConfig.find({}, (err: Error | null, docs: any) => {
      if (err) throw err
      if (docs.length === 0) {
        this.userConfig.insert({
          downloadFolder: app.getPath('userData')
        })
      }
    })
  }

  /**
   * 获取系统配置
   */
  getSysConfig (): Promise<string> {
    return new Promise((resolve, reject) => {
      this.userConfig.find({}, (err: Error | null, docs: IUserConfig[]) => {
        if (err) reject(err)
        if (docs.length) resolve(docs[0].downloadFolder)
        else resolve('')
      })
    })
  }

  /**
   * 下载列表
   */
  getDownList (): Promise<IDown[]> {
    return new Promise((resolve, reject) => {
      this.downList.find({}, (err: Error | null, docs: IDown[]) => {
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
      this.downList.insert(downItem, (err: Error | null, docs) => {
        console.log('insertDownItem')
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
      this.downList.remove(query, { multi: true }, (err: Error | null, docs) => {
        if (err) reject(err)
        resolve(docs)
      })
    })
  }

  /**
   * 获取全部的下载记录
   */
  getAllDownItem () {
    return new Promise((resolve, reject) => {
      this.downList.find({}, (err: Error | null, docs: IDown[]) => {
        if (err) reject(err)
        resolve(docs)
      })
    })
  }
}
