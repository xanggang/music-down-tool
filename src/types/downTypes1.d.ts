export type IDownStatusType = 'waitdown' | 'progressing' | 'completed'
  | 'cancelled' | 'interrupted';

// 下载完成的回调
export interface IDownFinishedCallBackPar {
  uuid: string;
  url: string;
  filePath: string;
  state: IDownStatusType;
}

/** ------- -- 数据结构整理----- ------- **/
// vuex发起 IDownItemOptions ipc的入参
// ipc包装一次 IDownQueueItem 下载管理器的入餐
// 下载管理器存储IDownQueueItem， 并且返回两个信息 IDownItemInfoType和IProgressParType
// vuex将IDownItemOptions， IDownItemInfoType， IProgressParType合并在一起

// vuex发起下载任务的时候的入参数
export interface IDownItemOptions {
  uuid: string;
  url: string;
  path: string;
  fileName: string; // 发起下载的时候的名字
  downFileName: string; // 下载中可能被更换的名字
  downloadFolder?: string;
  state: IDownStatusType;

  savePath: string; // 保存路径
  downURL: string; // 下载地址
  startTime?: number; // 开始下载时间
  icon?: string; // 文件图标
  isUserPause: boolean; // 是否暂停状态
  canResume: boolean; // 是否可以继续下载

  totalBytes: number; // 全部
  total: string;

  progressInfo: IProgressParType | {};
}

// 下载任务队列
export interface IDownQueueItem extends IDownItemOptions {
  downloadFolder: string;
  onProgress: (storeDownItem: IStoreDownItemType) => void;
  onFinishedDownload: (DownFinishedCallBackPar) => void;
}

// 进度条信息
export interface IProgressParType {
  uuid: string;
  progress: number; // 进度
  speedBytes: number; // 速度
  speed: string; // 速度
  remainingBytes: number; // 剩余
  remaining: string;
  totalBytes: number; // 全部
  total: string;
  downloadedBytes: number; // 已下载
  downloaded: string;
}
