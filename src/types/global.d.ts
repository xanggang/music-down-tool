declare namespace NodeJS {
  import { IDbType } from '@/types/db'
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
