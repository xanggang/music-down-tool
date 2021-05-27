export type IDownStatusType = 'waitdown' | 'progressing' | 'completed' | 'cancelled' | 'interrupted';

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
  type: string;
  path: string;
  fileName: string;
  downloadFolder?: string;
  // 区别于IDownItemInfoType的state， 这里的是整体的状态
  // 在IDownItemInfoType还不在的时候，这个就已经存在了
  state: IDownStatusType;
}

// 下载任务队列
export interface IDownQueueItem extends IDownItemOptions {
  downloadFolder: string;
  onProgress: (data: IProgressParType, info: IDownItemInfoType) => void;
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

// 下载信息
export interface IDownItemInfoType {
  uuid: string;
  savePath: string; // 保存路径
  downURL: string; // 下载地址
  mimeType: string; // MIME 类型
  hasUserGesture: boolean; // 是否具有用户手势
  fileName: string; // 下载文件名
  contentDisposition: string; // 响应头中的Content-Disposition字段
  startTime: number; // 开始下载时间
  state: IDownStatusType;
  icon?: string; // 文件图标
  isUserPause: boolean; // 是否暂停状态
  canResume: boolean; // 是否可以继续下载
}

// vuex里的任务队列
export interface IStoreDownItemType {
  option: IDownItemOptions;
  progressInfo: IProgressParType;
  downItemInfo: IDownItemInfoType;
}
