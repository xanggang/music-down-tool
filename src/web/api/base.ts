
const { ipcRenderer } = window.require('electron')

export default function<T> (startKey: string, endKey: string, params?: any): Promise<T> {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(startKey, params)
    ipcRenderer.once(endKey, function (event: any, arg: any) {
      if (arg.status) return resolve(arg.data)
      else return reject(new Error('错误'))
    })
  })
}
