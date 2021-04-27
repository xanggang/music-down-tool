import { Module } from 'vuex'

// 全局的配置信息
export interface IGlobalSettingModule {
  downloadFolder: string;
  userBasePath: string;
  sysConfig: string;
}

const globalSettingModule: Module<any, any> = {
  namespaced: true,
  state: {
    sysSetting: {}
  },
  mutations: {
    SAVE_ELECTRON_CONFIG (state, config) {
      console.log(config)
      state.sysSetting = config
    }
  },
  actions: {

  }
}

export default globalSettingModule
