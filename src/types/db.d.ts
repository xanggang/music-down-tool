import type Nedb from 'nedb'
import type { IDownItemOptions } from './downTypes'
import { IDownItemInfoType, IProgressParType } from './downTypes'
import DownList from '@/electorn/db/downList'

export interface IDBData {
  downloadFolder: string; // 用户的文件目录
  userBasePath: string; // 用户的根目录，安装的地址
  sysConfig: any;
  downList: any[]; // 下载记录
}

export interface ISysConfig {
  downloadFolder: string; // 用户的文件目录
  userBasePath: string; // 用户的根目录，安装的地址
  sysConfig: any;
}

export interface IDown extends IDownItemOptions{
  progressInfo: IProgressParType | {};
}

export interface IUserConfig {
  downloadFolder: string;
}

export interface IDbType {
  userConfig: Nedb<IUserConfig>;
  sysConfig: Nedb<any>;
  downList: DownList;
  playList: Nedb<any[]>;

  getSysConfig: () => any
}
