import 'reflect-metadata'
import type { ipcMain as IpcMainType, IpcMainEvent } from 'electron'

const PATH_METADATA = 'path'

const Ipc = (path: string): MethodDecorator => {
  return (target: Record<string, any>, key: any, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value)
  }
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

      const controller = async (event: IpcMainEvent, ...args: any[]) => {
        const instance = new prototype.constructor()
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
