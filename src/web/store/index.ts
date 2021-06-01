import { createStore, Store, useStore as useBaseStore, createLogger } from 'vuex'
import { InjectionKey } from 'vue'

import syncElectron from './plugins/syncElectron'
import setting, { IGlobalSettingModule } from './setting'

interface IStoreGlobalType {
  key?: any;
  setting: IGlobalSettingModule;
}

const storeMain = createStore<any>({
  modules: {
    setting
  },
  plugins: [createLogger(), syncElectron]
})

export const key: InjectionKey<Store<IStoreGlobalType>> = Symbol('vuexKey')

export default storeMain

export function useStore () {
  return useBaseStore<IStoreGlobalType>(key)
}

export function getStoreMain (): Store<any> {
  return storeMain as Store<any>
}
