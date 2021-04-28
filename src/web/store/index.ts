import { createStore, Store, useStore as useBaseStore, createLogger } from 'vuex'
import { InjectionKey } from 'vue'

import syncElectron from './plugins/syncElectron'
import setting from './setting'
import down, { IGlobalDownType } from './down'

interface IStoreGlobalType {
  down: IGlobalDownType;
}

const storeMain = createStore<any>({
  modules: {
    setting, down
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
