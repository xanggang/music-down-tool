import type { IDbType } from './db'
import type { DownLoadManagerClass } from '@/electorn/DownloadManager'

export interface IcpContentxType {
  db: IDbType;
  config: any;
  downLoadManager: DownLoadManagerClass;
}
