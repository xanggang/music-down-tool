type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
// 可以播放的文件
export type ICanPlayExeName = '.mp3'

// 本地音乐文件信息
export interface IMusicFileInfoTypes {
  uuid: string;
  path: string;
  size: number;
  lyric?: string; // 关联的歌词文件
  fileName: string;
  picture?: string; // 关联的封面
  extname: string; // 文件拓展名
  musicName: string; // 歌曲名
  album?: string; // 专辑名
  artist?: string; // 歌手
}

export interface IMp3InfoTypes {
  path: string;
  musicName?: string;
  album?: string;
  artist?: string;
}