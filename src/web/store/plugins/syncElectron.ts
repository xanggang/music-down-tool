import * as IpcEnums from '@/electorn/ipc/enums'
import { Store } from 'vuex'
const { ipcRenderer } = window.require('electron')
/**
 * 同步electron进程的配置数据
 */
export default function syncElectron (store: Store<any>) {
  // 主进程配置改变之后推送到前端
  ipcRenderer.on(IpcEnums.M_CHANG_SYS_SETTING, function (e: any) {
    console.log('接收到', IpcEnums.M_CHANG_SYS_SETTING)
    store.commit('setting/SAVE_ELECTRON_CONFIG', e)
  })
  // 前端第一次启动的时候主动同步主进程配置
  const res: any = ipcRenderer.sendSync(IpcEnums.V_CHANG_SYS_SETTING)
  store.commit('setting/SAVE_ELECTRON_CONFIG', res)

  ipcRenderer.on(IpcEnums.M_DOWN_PROGRESS, function (e: any, data: any) {
    store.commit('down/CHANGE_DOWN_PROGRESS', data)
  })
}
