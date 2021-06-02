import Datastore from 'nedb'
import path from 'path'
import fs from 'fs-extra'
import { app } from 'electron'
import { IUserConfig } from '@/types/db'
import DownList from './downList'

export default class Db {
  userConfig: Nedb<IUserConfig>
  sysConfig: Nedb<any>
  downList: DownList
  playList: Nedb<any[]>

  constructor () {
    const bastDir = global.userBasePath
    if (!fs.pathExistsSync(bastDir)) { // 如果不存在路径
      fs.mkdirpSync(bastDir) // 就创建
    }

    this.downList = new DownList()

    this.userConfig = new Datastore({
      filename: path.join(bastDir, '/userConfig.json'),
      autoload: true
    })

    this.sysConfig = new Datastore({
      filename: path.join(bastDir, '/sysConfig.json'),
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
          key: 'CONFIG_MAIN',
          downloadFolder: app.getPath('userData')
        })
      }
    })
  }

  /**
   * 获取系统配置
   */
  getSysConfig (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userConfig.find({ key: 'CONFIG_MAIN' }, (err: Error | null, docs: IUserConfig[]) => {
        if (err) reject(err)
        if (docs.length) resolve(docs[0])
        else resolve({})
      })
    })
  }

  async getDownloadFolder () {
    const config = await this.getSysConfig()
    console.log('-------')
    console.log(config.downloadFolder)
    if (!config) return ''
    return config.downloadFolder
  }

  /**
   * 修改下載儲存目錄
   */
  changeDownloadFolder (path: string) {
    const query = { key: 'CONFIG_MAIN' }
    const updateQuery: any = {
      $set: {
        downloadFolder: path
      }
    }
    this.userConfig.update(query, updateQuery)
  }
}
