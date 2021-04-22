declare namespace NodeJS {
    import BrowserWindow = Electron.BrowserWindow

    type configType = {
        configUrl: string;
        microApi: string;
    }
    interface Global {
        launcherVersion: string;
        launcher: any;
        isDevelopment: boolean;
        isServer: boolean;
        isInSingleMode: boolean;
        isTest: boolean;
        env: string;
        currentVersion: string;
        successInit: boolean;
        userDir: string;
        emit: EventEmitter;
        staticDir: string;
        launcherStaticDir: string;
        config: configTypel;
    }
}

declare const __static: string
