import { Module } from 'vuex'
import * as IpcEnums from '@/electorn/ipc/enums'
import { v4 as uuidv4 } from 'uuid'
import type { IDownOptions, IDownFinishedCallBackPar, IProgressParType, IDownItemInfoType } from '@/types/downTypes'
import * as fileUtils from '@/web/util/fileUtil'
const { ipcRenderer } = window.require('electron')

interface IDownItem {
  itemInfo: IDownItemInfoType;
  process: IProgressParType;
}

export interface IGlobalDownType {
  waitDownloadList: IDownItem[]; // 下载队列
  downList: IDownItem[];
  downedList: IDownItem[];
}

const globalDownModule: Module<IGlobalDownType, any> = {
  namespaced: true,
  state: {
    waitDownloadList: [], // 等待下载的队列 todo 类型有点问题
    downList: [

    ], // 正在下载中的队列
    downedList: [] // 下载完成的队列
  },
  mutations: {
    // 添加一个下载任务
    ADD_DOWN_TASK (state, data) {
      state.waitDownloadList.push(data)
    },
    // 下载进度条
    CHANGE_DOWN_PROGRESS (state, { itemInfo, process }) {
      const queueItem = state.downList.find((item: IDownItem) => item.itemInfo.uuid === itemInfo.uuid)
      if (!queueItem) {
        // 这一个任务刚开始下载
        state.downList.push({ itemInfo, process })
        return
      }
      queueItem.process = process
    },
    // 下载完成
    DOWN_SUCCESS (state, data: IDownFinishedCallBackPar) {
      const queueItemIndex = state.downList.findIndex((item: IDownItem) => item.itemInfo.uuid === data.uuid)
      if (queueItemIndex < 0) throw new Error('进度条更新失败，下载的文件不在队列中')
      const queueItemArr = state.downList.splice(queueItemIndex, 1)
      const queueItem = queueItemArr[0]
      const icon = ipcRenderer.sendSync(IpcEnums.V_GET_FILE_ICON, queueItem.itemInfo.savePath)
      console.log(icon)
      queueItem.itemInfo.state = data.state
      queueItem.itemInfo.icon = icon
      state.downedList.push(queueItem)
      console.log('下载完成')
    }
  },
  actions: {
    downFile ({ commit }, { url, type }) {
      const { ext, name } = fileUtils.getFileNameTool(url)
      console.log({ ext, name })
      const queueItem: IDownOptions = {
        uuid: uuidv4(),
        url: url,
        type: type,
        state: 'waitdown',
        canResume: true,
        isUserPause: true,
        fileName: name + ext
      }
      commit('ADD_DOWN_TASK', {
        itemInfo: queueItem,
        process
      })
      const res = ipcRenderer.sendSync(IpcEnums.V_DOWN_FILE, queueItem)
      if (res === 'failed') {
        console.log('添加下载任务失败')
      }
    },
    batchDownFiles ({ dispatch }, fileList) {
      fileList.forEach((file: any) => {
        dispatch('downFile', file)
      })
    }
  }
}

export default globalDownModule
