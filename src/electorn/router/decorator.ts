import 'reflect-metadata'
import type { ipcMain as IpcMainType, IpcMainEvent } from 'electron'
import getDownLoadManager, { DownLoadManagerClass } from '../DownloadManager'
import type { IcpContentxType } from '@/types/icpContentxType'

const PATH_METADATA = 'path'

const Ipc = (path: string): MethodDecorator => {
  return (target: Record<string, any>, key: any, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value)
  }
}

function getCtx () {
  const ctx: IcpContentxType = {
    db: global.db,
    config: global.db.get('sysConfig').value(),
    downLoadManager: {} as DownLoadManagerClass
  }
  const downLoadManager = getDownLoadManager(ctx)
  ctx.downLoadManager = downLoadManager

  return ctx
}

function getRouter (ipcMain: typeof IpcMainType, controllerList: any[]) {
  controllerList.forEach((value: any) => {
    const prototype = value.prototype
    const propertyNames = Object.getOwnPropertyNames(prototype)
      .filter(pName => {
        return pName !== 'constructor'
      })
    propertyNames.forEach(name => {
      const path = Reflect.getMetadata(PATH_METADATA, prototype[name])
      const ctx = getCtx()
      const controller = async (event: IpcMainEvent, ...args: any[]) => {
        const instance = new prototype.constructor(ctx)
        await instance[name](event, ...args)
      }
      ipcMain.on(path, controller)
    })
  })
}

export {
  Ipc,
  getRouter
}
