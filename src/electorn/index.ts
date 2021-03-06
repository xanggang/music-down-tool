import { app, BrowserWindow } from 'electron'
import installExtension from 'electron-devtools-installer'
import createAsarProtocol from './protocol'
import MenuApp from './menu/index'
import initIpcEvent from './router'
import type { IDbType } from '@/types/db'

export default class ElectronApp {
  protected isDevToolInit = false // 是否已经启用开发工具
  protected win: BrowserWindow | null = null // 窗口
  protected menu: MenuApp | null = null
  protected db: IDbType | null = null

  /**
   * @description 注入开发工具
   */
  protected async initDevTools () {
    if (!this.isDevToolInit && global.isDevelopment) {
      this.isDevToolInit = true

      // Install Vue Devtools
      try {
        console.log('下载vue crx 文件')
        await installExtension('ljjemllljcmogpfapbkkighbhhppjdbg')
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
      this.openDevTools()
    }
  }

  /**
   *@description app 事件注册
   */
  protected async addLeas () {
    app.on('window-all-closed', () => {
      // this.db.a()
      app.quit()
    })
  }

  /**
   * @description 创建一个窗口
   */
  createWindow () {
    let win: BrowserWindow | null = new BrowserWindow({
      width: 1020,
      height: 710,
      show: false,
      minWidth: 1020,
      minHeight: 710,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        nodeIntegrationInSubFrames: false,
        scrollBounce: true,
        backgroundThrottling: true
      },
      titleBarStyle: 'hidden'
      // icon: path.join(global.launcherStaticDir, "icon.png"),
      // preload: path.join(__dirname, '../renderer.js'),
    })
    this.win = win

    /**
     * @description 窗口关闭前触发
     */
    win.on('close', () => {
      win && win.webContents.send('closed-win')
    })

    /**
     * @description 窗口关闭后触发
     */
    win.on('closed', () => {
      win = null
    })

    /**
     * @description 进入全屏状态
     */
    win.on('enter-full-screen', () => {
      win && win.webContents.send('enter-full')
    })

    /**
     * @description 退出全屏状态
     */
    win.on('leave-full-screen', () => {
      win && win.webContents.send('leave-full')
    })

    /**
     * @description 监听重制窗口大小
     */
    win.on('resize', () => {
      if (!win) return
      const data = win.getSize()
      win.webContents.send('win-resize', { data })
    })

    /**
     * @description 监听新建窗口
     */
    win.webContents.on('new-window', (event) => {
      event.preventDefault()
    })

    /**
     * @description 显示窗口
     */
    win.once('ready-to-show', () => {
      if (win) win.show()
    })

    return win
  }

  /**
   * 根据配置加载一个应用
   */
  async loadApp () {
    this.db = global.db
    createAsarProtocol()
    const mainWin = this.createWindow()
    initIpcEvent()
    await this.initDevTools()
    await this.registerMenu()
    if (global.isDevelopment) {
      // todo 本地启动地址
      await mainWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    } else {
      await mainWin.loadURL('app://./index.html')
    }
  }

  /**
   * 注册菜单和快捷键
   */
  registerMenu () {
    this.menu = new MenuApp(this)
  }

  /**
   * 刷新页面
   */
  refreshWindow () {
    if (!this.win) return
    this.win.loadURL('app://./index.html')
  }

  /**
   * 打开调试面板
   */
  openDevTools () {
    if (!this.win) return
    this.win.webContents.openDevTools()
  }
}
