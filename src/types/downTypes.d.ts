
// 创建下载队列的入参数
export interface IDownOptions {
  url: string;
  downloadFolder?: string;
}

// 下载队列
export interface IDownQueueType {
  uuid: string;
  url: string;
  filename: string; // 文件名
  downloadFolder: string; // 下载的文件夹
  path: string; // 文件夹下的目录
  onProgress: (data: IProgressParType) => void;
  onFinishedDownload?: (data: any) => void;
}

/**
 * 进度条信息
 */
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
