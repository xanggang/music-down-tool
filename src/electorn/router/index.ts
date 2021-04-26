import { ipcMain } from 'electron'
import { getRouter } from './decorator'
import config from '../controller/config'
/**
 * 注册全部的ipc事件
 */
export default function () {
  try {
    getRouter(ipcMain, [config])
  } catch (err) {
    console.error(err)
  }
}
