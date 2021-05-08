import path from 'path'
import fs from 'fs-extra'
import { dialog, OpenDialogSyncOptions } from 'electron'

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

/**
 * 获取文件的拓展名
 * @param url
 */
export function getFileName (url: string) {
  return path.basename(url)
}

/**
 * 选择一个文件，获取其路径， 单选
 */
export function getFilePath (ext: string[] = []): string | null {
  const options = {
    title: '请选择文件',
    defaultPath: '',
    buttonLabel: '确认',
    filters: [
      { name: 'Custom File Type', extensions: ext.length ? ext : ['*'] }
    ],
    properties: ['openFile']
  }
  const request = dialog.showOpenDialogSync(options as OpenDialogSyncOptions)
  if (!(request && request.length)) return null
  return request[0]
}

/**
 * 同步读取一个文件
 * @param path
 */
export function readFileAsync (path: string) {
  if (!path) throw new Error('文件路径不存在')
  try {
    const res = fs.readFileSync(path)
    const st = res.toString()
    return st
  } catch (err) {
    throw new Error(`读取文件失败:${path}`)
  }
}
