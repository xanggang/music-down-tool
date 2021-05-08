import { Module } from 'vuex'
import { toRaw } from 'vue'
import * as IpcEnums from '@/electorn/ipc/enums'
import { v4 as uuidv4 } from 'uuid'
import * as fileUtils from '@/web/util/fileUtil'
import { message } from 'ant-design-vue'
import type { IStoreDownItemType, IDownFinishedCallBackPar } from '@/types/downTypes'
import { IDownItemOptions } from '@/types/downTypes'

const { ipcRenderer } = window.require('electron')

export interface IGlobalDownType {
  waitDownloadList: IStoreDownItemType[]; // 下载队列
  downloadingList: IStoreDownItemType[];
  downloadList: IStoreDownItemType[];
  maxCount: number;
}

const globalDownModule: Module<IGlobalDownType, any> = {
  namespaced: true,
  state: {
    waitDownloadList: [], // 等待下载的队列 todo 类型有点问题
    downloadingList: [], // 正在下载中的队列, 有进度条的
    downloadList: [], // 下载完成的队列
    maxCount: 1 // 下载线程
  },
  mutations: {
    // 添加一个下载任务
    ADD_DOWN_TASK (state, data) {
      state.waitDownloadList.push(data)
    },
    // 从下载队列取出一个放在下载中
    SHIFT_DOWN_TASK (state, length) {
      const list = state.waitDownloadList.splice(0, length)
      state.downloadingList = [...state.downloadingList, ...list]
    },
    // 下载进度条
    CHANGE_DOWN_PROGRESS (state, { progressInfo, downItemInfo }) {
      const queueItem = state.downloadingList.find((item: IStoreDownItemType) => item.option.uuid === downItemInfo.uuid)
      if (!queueItem) {
        return
      }
      queueItem.progressInfo = progressInfo
      queueItem.downItemInfo = downItemInfo
      console.log(queueItem)
    },
    // 下载完成
    DOWN_SUCCESS (state, data: IDownFinishedCallBackPar) {
      const queueItemIndex = state.downloadingList.findIndex((item: IStoreDownItemType) => item.option.uuid === data.uuid)
      if (queueItemIndex < 0) throw new Error('进度条更新失败，下载的文件不在队列中')
      const queueItemArr = state.downloadingList.splice(queueItemIndex, 1)
      const queueItem = queueItemArr[0]
      const icon = ipcRenderer.sendSync(IpcEnums.V_GET_FILE_ICON, queueItem.downItemInfo.savePath)
      queueItem.downItemInfo.state = data.state
      queueItem.downItemInfo.icon = icon
      state.downloadList.push(queueItem)
      console.log('下载完成')
    },
    // 暂停下载
    DOWN_PAUSE (state, uuid) {
      const item = state.downloadingList.find(item => item.downItemInfo.uuid === uuid)
      if (!item) return
      item.downItemInfo.state = 'progressing'
      item.downItemInfo.isUserPause = true
    },
    // 继续下载
    DOWN_RESUME (state, uuid) {
      const item = state.downloadingList.find(item => item.downItemInfo.uuid === uuid)
      if (!item) return
      item.downItemInfo.state = 'progressing'
      item.downItemInfo.isUserPause = false
    },
    // 删除下载11
    DOWN_DELETE (state, uuid) {
      const index = state.downloadingList.findIndex(item => item.downItemInfo.uuid === uuid)
      state.downloadingList.splice(index, 1)
    },
    // 下载取消
    DOWN_CANCEL (state, uuid) {
      const item = state.downloadingList.find(item => item.downItemInfo.uuid === uuid)
      if (!item) return
      item.downItemInfo.state = 'cancelled'
      item.downItemInfo.isUserPause = false
    }
  },
  actions: {
    addDownFileTask ({ commit, dispatch }, { url, type, songName }) {
      const { ext } = fileUtils.getFileNameTool(url)
      const queueItem: IDownItemOptions = {
        uuid: uuidv4(),
        url: url,
        type: type,
        path: 'electronDown/' + songName,
        fileName: songName + uuidv4() + ext
      }
      commit('ADD_DOWN_TASK', {
        option: queueItem,
        progressInfo: {},
        downItemInfo: {}
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
      const downLength = state.downloadingList.length
      const downNum = maxCount - downLength
      if (downNum <= 0) return
      const list: any = state.waitDownloadList.slice(0, downNum)
      list.forEach((queueItem: any) => {
        console.log(toRaw(queueItem))
        const res = ipcRenderer.sendSync(IpcEnums.V_DOWN_FILE, toRaw(queueItem.option))
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
