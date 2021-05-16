import { ipcMain } from 'electron'
import { getRouter } from './decorator'
import config from '../controller/config'
import downFile from '../controller/downFile'
import playList from '../controller/playList'
import songSearch from '../controller/songSearch'
/**
 * 注册全部的ipc事件
 */
export default function () {
  try {
    getRouter(ipcMain, [config, downFile, playList, songSearch])
  } catch (err) {
    console.error(err)
  }
}
