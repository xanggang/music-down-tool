import path from 'path'
import fs from 'fs-extra'

/**
 * 获取文件指定拓展名的全部文件晋西
 * @param extname
 * @param dirPath
 */
export interface IDirFileInfo {
  filePath: string;
  name: string;
  size: number;
}
export function getDirFiles (extname: string, dirPath: string): IDirFileInfo[] {
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

export function getFileName (url: string) {
  return path.basename(url)
}

export function getFileExit () {

}
