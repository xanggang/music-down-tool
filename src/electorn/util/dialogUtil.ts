import { dialog, OpenDialogSyncOptions } from 'electron'

export default class {
  /**
   * 从系统中选择一个文件夹， 获取路径
   */
  static getFolderPath (): string | null {
    const options = {
      title: '请选择文件夹',
      defaultPath: '',
      buttonLabel: '确认',
      properties: ['openDirectory', 'createDirectory', 'promptToCreate']
    }
    const request = dialog.showOpenDialogSync(options as OpenDialogSyncOptions)
    if (request && request.length) return request[0]
    return null
  }

  /**
   * 从系统中选择一个文件， 获取路径
   */
  static getFilePath (ext: string[] = []): string | null {
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
    if (request && request.length) return request[0]
    return null
  }
}
