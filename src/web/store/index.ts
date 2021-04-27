import { createStore, Store, useStore as useBaseStore, createLogger } from 'vuex'
import { InjectionKey } from 'vue'

import syncElectron from './plugins/syncElectron'
import setting from './setting'
import down from './down'

const storeMain = createStore({
  modules: {
    setting, down
  },
  plugins: [createLogger(), syncElectron]
})

export const key: InjectionKey<Store<any>> = Symbol('vuexKey')

export default storeMain

export function useStore () {
  return useBaseStore<any>(key)
}

export function getStoreMain (): Store<any> {
  return storeMain as Store<any>
}
