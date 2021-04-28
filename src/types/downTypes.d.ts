
export type IDownStatusType = 'waitdown' | 'progressing' | 'completed' | 'cancelled' | 'interrupted';

// 创建下载队列的入参数
export interface IDownOptions {
  uuid: string;
  url: string;
  type: string;
  fileName: string;
  state: IDownStatusType;
  downloadFolder?: string;
  canResume: boolean; // 是否可以重新下载
  isUserPause: boolean; // 是否是用户暂停
  orginName?: string; // 原始文件名字
  progressInfo?: IProgressParType;
}

// 下载队列
export interface IDownQueueType {
  uuid: string;
  url: string;
  filename: string; // 文件名
  downloadFolder: string; // 下载的文件夹
  path: string; // 文件夹下的目录
  onProgress: (data: IProgressParType, info: IDownItemInfoType) => void;
  onFinishedDownload: (DownFinishedCallBackPar) => void;
}

// 下载完成的回调
export interface IDownFinishedCallBackPar {
  uuid: string;
  url: string;
  filePath: string;
  state: IDownStatusType;
}

// 下载信息
export interface IDownItemInfoType {
  uuid: string;
  savePath: string; // 保存路径
  downURL: istring; // 下载地址
  mimeType: string; // MIME 类型
  hasUserGesture: boolean; // 是否具有用户手势
  fileName: string; // 下载文件名
  contentDisposition: string; // 响应头中的Content-Disposition字段
  startTime: number; // 开始下载时间
  state: IDownStatusType;
  icon?: string; // 文件图标
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

// vuex里存储的队列信息
export interface IWebDownItemType {
  itemInfo: IDownItemInfoType;
  process: IProgressParType;
}
