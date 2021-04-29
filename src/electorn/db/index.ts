import lowdb, { LowdbSync } from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import lodashId from 'lodash-id'
import { app } from 'electron'

import type { IDBData } from '@/types/db'

export default function (): LowdbSync<IDBData> {
  const bastDir = global.userBasePath
  if (!fs.pathExistsSync(bastDir)) { // 如果不存在路径
    fs.mkdirpSync(bastDir) // 就创建
  }
  const filePath = path.join(bastDir, '/data.json')
  console.log(`\x1b[42;30m 数据文件地址 \x1b[40;32m ${filePath}\x1B[0m`)

  const adapter = new FileSync(filePath)
  const db = lowdb(adapter)
  db._.mixin(lodashId)

  // 设置默认配置
  db.defaults({
    downloadFolder: app.getPath('userData'),
    userBasePath: '',
    sysConfig: ''
  }).write()

  return db
}
