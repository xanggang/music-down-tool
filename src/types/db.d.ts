import type Nedb from 'nedb'
import type { IDownItemOptions } from './downTypes'
import { IDownItemInfoType, IProgressParType } from './downTypes'

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

export interface IDown {
  option: IDownItemOptions;
  progressInfo: IProgressParType | {};
  downItemInfo: IDownItemInfoType | {};
}

export interface IUserConfig {
  downloadFolder: string;
}

export interface IDbType {
  userConfig: Nedb<IUserConfig>;
  sysConfig: Nedb<any>;
  downList: Nedb<IDown[]>;
  playList: Nedb<any[]>;

  getSysConfig: () => Promise<string>;
  getDownList: () => Promise<IDown[]>;
  insertDownItem: (downItem: IDown) => Promise<IDown>;
}
