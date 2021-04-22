import type ElectronApp from '../index'
// 注册菜单和快捷键
import { Menu } from 'electron'

/**
 * 菜单管理
 */
export default class MenuApp {
  app: ElectronApp

  constructor (app: ElectronApp) {
    this.app = app
    this.registerMenu()
  }

  registerMenu () {
    const template = [
      { label: '首页' },
      {
        label: '新闻资讯',
        submenu: [
          {
            label: '国内新闻',
            submenu: [
              {
                label: '北京新闻'
              },
              {
                label: '河南新闻'
              }
            ]
          },
          {
            label: '国际新闻'
          }
        ]
      },
      {
        label: '刷新',
        submenu: [
          {
            label: '1',
            // role: 'redo',
            accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Alt+Shift+I',
            click: () => {
              this.app.refreshWindow()
            }
          }
        ]
      },
      {
        label: '打开调试台',
        submenu: [
          {
            label: '1',
            // role: 'redo',
            accelerator: process.platform === 'darwin' ? 'Cmd+E' : 'Alt+Shift+I',
            click: () => {
              this.app.openDevTools()
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:'
          },
          {
            label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'
          }
        ]
      }
    ]
    const list = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(list)
  }
}
