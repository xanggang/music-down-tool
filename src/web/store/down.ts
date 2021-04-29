import { Module } from 'vuex'
import { toRaw } from 'vue'
import * as IpcEnums from '@/electorn/ipc/enums'
import { v4 as uuidv4 } from 'uuid'
import type { IDownOptions, IDownFinishedCallBackPar, IProgressParType, IDownItemInfoType } from '@/types/downTypes'
import * as fileUtils from '@/web/util/fileUtil'
import { message } from 'ant-design-vue'

const { ipcRenderer } = window.require('electron')

interface IDownItem {
  itemInfo: IDownItemInfoType;
  process: IProgressParType;
}

export interface IGlobalDownType {
  waitDownloadList: IDownItem[]; // 下载队列
  downList: IDownItem[];
  downedList: IDownItem[];
  maxCount: number;
}

const globalDownModule: Module<IGlobalDownType, any> = {
  namespaced: true,
  state: {
    waitDownloadList: [], // 等待下载的队列 todo 类型有点问题
    downList: [], // 正在下载中的队列, 有进度条的
    downedList: [], // 下载完成的队列
    maxCount: 1 // 下载线程
  },
  mutations: {
    // 添加一个下载任务
    ADD_DOWN_TASK (state, data) {
      state.waitDownloadList.push(data)
    },
    // 从下载队列取出一个用于下载
    SHIFT_DOWN_TASK (state, length) {
      const list = state.waitDownloadList.splice(0, length)
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
    },
    // 暂停下载
    DOWN_PAUSE (state, uuid) {
      const item = state.downList.find(item => item.itemInfo.uuid === uuid)
      if (!item) return
      item.itemInfo.state = 'progressing'
      item.itemInfo.isUserPause = true
    },
    // 继续下载
    DOWN_RESUME (state, uuid) {
      const item = state.downList.find(item => item.itemInfo.uuid === uuid)
      if (!item) return
      item.itemInfo.state = 'progressing'
      item.itemInfo.isUserPause = false
    },
    // 删除下载11
    DOWN_DELETE (state, uuid) {
      const index = state.downedList.findIndex(item => item.itemInfo.uuid === uuid)
      state.downedList.splice(index, 1)
    },
    // 下载取消
    DOWN_CANCEL (state, uuid) {
      const item = state.downList.find(item => item.itemInfo.uuid === uuid)
      if (!item) return
      item.itemInfo.state = 'cancelled'
      item.itemInfo.isUserPause = false
    }
  },
  actions: {
    addDownFileTask ({ commit, dispatch }, { url, type }) {
      const { ext, name } = fileUtils.getFileNameTool(url)
      const queueItem: IDownOptions = {
        uuid: uuidv4(),
        url: url,
        type: type,
        state: 'waitdown',
        fileName: name + ext
      }
      commit('ADD_DOWN_TASK', {
        itemInfo: queueItem,
        process
      })
      dispatch('limitDownCount')
    },
    batchAddDownFileTask ({ dispatch }, fileList) {
      fileList.forEach((file: any) => {
        dispatch('addDownFileTask', file)
      })
    },
    limitDownCount ({ commit, state }) {
      const maxCount = state.maxCount
      const downLength = state.downList.length
      const downNum = maxCount - downLength
      if (downNum <= 0) return
      const list: any = state.waitDownloadList.slice(0, downNum)
      list.forEach((queueItem: any) => {
        console.log(toRaw(queueItem))
        const res = ipcRenderer.sendSync(IpcEnums.V_DOWN_FILE, toRaw(queueItem.itemInfo))
        if (res === 'failed') {
          console.log('添加下载任务失败')
        }
      })
      commit('SHIFT_DOWN_TASK', downNum)
    },
    handleDownSuccess ({ commit, dispatch }, data: IDownFinishedCallBackPar) {
      commit('DOWN_SUCCESS', data)
      dispatch('limitDownCount')
    },
    handleDownPause ({ commit }, uuid) {
      const res = ipcRenderer.sendSync(IpcEnums.V_PAUSE_DOWN, uuid)
      if (res === 'success') commit('DOWN_PAUSE', uuid)
      else message.error(res)
    },
    handleDownResume ({ commit }, uuid) {
      const res = ipcRenderer.sendSync(IpcEnums.V_RESUME_DOWN, uuid)
      if (res === 'success') commit('DOWN_RESUME', uuid)
      else message.error(res)
    },
    handleDownDelete ({ commit }, uuid) {
      const res = ipcRenderer.sendSync(IpcEnums.V_DELETE_DOWN, uuid)
      if (res === 'success') commit('DOWN_DELETE', uuid)
      else message.error(res)
    },
    handleDownCancel ({ commit }, uuid) {
      const res = ipcRenderer.sendSync(IpcEnums.V_CANCEL_DOWN, uuid)
      if (res === 'success') commit('DOWN_CANCEL', uuid)
      else message.error(res)
    }
  }
}

export default globalDownModule
