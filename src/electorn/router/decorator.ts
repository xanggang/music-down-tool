import 'reflect-metadata'
import type { ipcMain as IpcMainType, IpcMainEvent } from 'electron'
import getDownLoadManager, { DownLoadManagerClass } from '../DownloadManager'
import type { IcpContentxType } from '@/types/icpContentxType'
import type { IDbType } from '@/types/db'

const PATH_METADATA = 'path'

const Ipc = (path: string): MethodDecorator => {
  return (target: Record<string, any>, key: any, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value)
  }
}

function getCtx () {
  const ctx: IcpContentxType = {
    db: global.db as IDbType,
    config: global.db.userConfig,
    downLoadManager: {} as DownLoadManagerClass
  }
  const downLoadManager = getDownLoadManager(ctx)
  ctx.downLoadManager = downLoadManager

  return ctx
}

function getRouter (ipcMain: typeof IpcMainType, controllerList: any[]) {
  console.log('\x1b[42;30m 加载ipc通讯\x1B[0m')
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
