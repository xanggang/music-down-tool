type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
// 可以播放的文件
export type ICanPlayExeName = '.mp3'

// 本地音乐文件信息
export interface IMusicFileInfoTypes {
  path: string;
  size: number;
  length: number;
  linkLyric?: string; // 关联的歌词文件
  fileName: string;
  linkImg?: string; // 关联的封面
  extname: string; // 文件拓展名
  musicName: string; // 歌曲名
  album?: string; // 专辑名
  artist?: string; // 歌手
}

export type IMp3InfoTypes = Omit<IMusicFileInfoTypes, 'size' | 'fileName'>
