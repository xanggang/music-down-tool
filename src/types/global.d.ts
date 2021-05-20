declare namespace NodeJS {
    import BrowserWindow = Electron.BrowserWindow
  import { IDbType } from '../electorn/db'
    type configType = {
        configUrl: string;
        microApi: string;
    }
    interface Global {
      env: string;
      isDevelopment: boolean;
      staticDir: string;
      downloadFolder: string;
      userBasePath: string;
      sysConfig: object;
      db: IDbType;
    }
}

declare const __static: string
