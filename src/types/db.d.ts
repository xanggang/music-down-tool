import { LowdbSync } from 'lowdb'

export interface IDBData {
  downloadFolder: string; // 用户的文件目录
  userBasePath: string; // 用户的根目录，安装的地址
  sysConfig: any;
  downList: any[]; // 下载记录
}

export type IDbType = LowdbSync<IDBData>
