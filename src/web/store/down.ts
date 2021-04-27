import { Module } from 'vuex'

export interface IGlobalDownType {
  queue: any[]; // 下载队列
}

const globalDownModule: Module<any, any> = {
  namespaced: true,
  state: {
    queue: []
  },
  mutations: {
    // 添加一个下载任务
    ADD_DOWN_TASK (state, data) {
      state.queue.push(data)
    },
    // 下载进度条
    CHANGE_DOWN_PROGRESS (state, data) {
      console.log(data)
      return
      const queue = state.queue.find((item: any) => item.uuid === data.uuid)
      queue.progressInfo = data
    }
  },
  actions: {

  }
}

export default globalDownModule
