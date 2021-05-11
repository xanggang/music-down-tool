import path from 'path'
import fs from 'fs-extra'
import MusicUtil from '@/electorn/util/musicUtil'
import type { IMusicFileInfoTypes } from '@/types/playListTypes'
/**
 * 获取文件指定拓展名的全部文件
 * @param extname
 * @param dirPath
 */
export interface IDirFileInfo {
  filePath: string;
  name: string;
  size: number;
}

export default class FileUtil {
  /**
   * 获取文件的拓展名
   * @param url
   */
  static getFileName (url: string): string {
    return path.extname(url)
  }

  /**
   * 获取一个文件夹下全部的文件， 指定拓展名
   * @param extname
   * @param dirPath
   */
  static getDirFiles (extname: string, dirPath: string): IDirFileInfo[] {
    const fileInfoList = []
    if (!fs.existsSync(dirPath)) {
      return []
    }
    const fileList = fs.readdirSync(dirPath)
    if (!fileList.length) return []
    for (const file of fileList) {
      const localPath = dirPath + path.sep + file
      if (fs.statSync(localPath).isDirectory()) continue
      const fileExt = path.extname(file)
      if (fileExt !== extname) continue
      fileInfoList.push({
        filePath: localPath,
        name: file,
        size: fs.statSync(localPath).size
      })
    }

    return fileInfoList
  }

  /**
   * 同步读取一个文件
   * @param path
   */
  static readFileAsync (path: string) {
    if (!path) throw new Error('文件路径不存在')
    try {
      const res = fs.readFileSync(path)
      const st = res.toString()
      return st
    } catch (err) {
      throw new Error(`读取文件失败:${path}`)
    }
  }

  /**
   * 递归的读取一个文件夹， 获取指定
   * @param extNames 过滤拓展名
   * @param dirPath
   * @param list
   */
  static async deepReadDir (extNames: string[], dirPath: string, list?: IMusicFileInfoTypes[]): Promise< IMusicFileInfoTypes[]> {
    let fileInfoList: IMusicFileInfoTypes[] = list && list.length ? list : []
    if (!fs.existsSync(dirPath)) {
      return []
    }

    const fileList = fs.readdirSync(dirPath)
    if (!fileList.length) return []

    for await (const file of fileList) {
      const localPath = dirPath + path.sep + file
      const fileStat = fs.statSync(localPath)
      if (fileStat.isDirectory()) {
        fileInfoList = await this.deepReadDir(extNames, localPath, fileInfoList)
        continue
      }
      const fileExt = path.extname(file)
      if (extNames.includes(fileExt)) {
        const info: IMusicFileInfoTypes = await MusicUtil.getMp3Info(localPath) as IMusicFileInfoTypes
        info.size = fileStat.size
        info.fileName = file
        fileInfoList.push(info)
      }
    }

    return fileInfoList
  }
}
