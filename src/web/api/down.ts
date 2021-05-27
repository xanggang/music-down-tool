import APi from '@/electorn/enums/ApiEnums'
const { ipcRenderer } = window.require('electron')

export async function handleClearAll () {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(APi.DownFileApi.V_CLEAR_ALL_START)
    ipcRenderer.once(APi.DownFileApi.V_CLEAR_ALL_END, function (event: any, arg: any) {
      if (arg) resolve(true)
      else reject(new Error('删除失败'))
    })
  })
}

export async function handleGetDownHistoryList () {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(APi.DownFileApi.V_GET_DOWN_LIST_START)
    ipcRenderer.once(APi.DownFileApi.V_GET_DOWN_LIST_END, function (event: any, arg: any) {
      if (arg) resolve(arg)
      else reject(new Error('查询失败'))
    })
  })
}
