import * as IpcEnums from '@/electorn/ipc/enums'
import { Store } from 'vuex'
const { ipcRenderer } = window.require('electron')
/**
 * 同步electron进程的配置数据
 */
export default function syncElectron (store: Store<any>) {
  ipcRenderer.on(IpcEnums.M_CHANG_SYS_SETTING, function (e: any) {
    store.commit('setting/SAVE_ELECTRON_CONFIG', e)
  })
  const res: any = ipcRenderer.sendSync(IpcEnums.R_CHANG_SYS_SETTING)
  store.commit('setting/SAVE_ELECTRON_CONFIG', res)
}
