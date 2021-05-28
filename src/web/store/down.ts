import { Module } from 'vuex'
import { toRaw } from 'vue'
import Api from '@/electorn/enums/ApiEnums'
import * as DownApi from '@/web/api/down'
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
      const icon = ipcRenderer.sendSync(Api.ToolApi.V_GET_FILE_ICON, queueItem.downItemInfo.savePath)
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
    // 删除下载
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
    },
    // 清除下载记录
    DOWN_CLEAR_ALL (state) {
      state.downloadList = []
    },
    // 同步下载记录
    GET_DOWN_HISTORY (state, data) {
      state.downloadList = data
    }
  },
  actions: {
    addDownFileTask ({ commit, dispatch }, { url, type }) {
      const { ext, name } = fileUtils.getFileNameTool(url)
      const queueItem: IDownItemOptions = {
        uuid: uuidv4(),
        state: 'waitdown',
        url: url,
        type: type,
        path: 'electronDown',
        fileName: name + ext
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
        const res = ipcRenderer.sendSync(Api.DownFileApi.V_DOWN_FILE, toRaw(queueItem.option))
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
      const res = ipcRenderer.sendSync(Api.DownFileApi.V_PAUSE_DOWN, uuid)
      if (res === 'success') commit('DOWN_PAUSE', uuid)
      else message.error(res)
    },

    handleDownResume ({ commit }, uuid) {
      const res = ipcRenderer.sendSync(Api.DownFileApi.V_RESUME_DOWN, uuid)
      if (res === 'success') commit('DOWN_RESUME', uuid)
      else message.error(res)
    },

    handleDownDelete ({ commit }, uuid) {
      const res = ipcRenderer.sendSync(Api.DownFileApi.V_DELETE_DOWN, uuid)
      console.log({ res })
      if (res === 'success') commit('DOWN_DELETE', uuid)
      else message.error(res)
    },

    handleDownCancel ({ commit }, uuid) {
      const res = ipcRenderer.sendSync(Api.DownFileApi.V_CANCEL_DOWN, uuid)
      if (res === 'success') commit('DOWN_CANCEL', uuid)
      else message.error(res)
    },


    handlePauseAll ({ commit }) {
      const res: string[] | 'failed' = ipcRenderer.sendSync(Api.DownFileApi.V_PAUSE_ALL)
      if (res === 'failed') message.error('全部暂停操作失败')
      else res.forEach(uuid => commit('DOWN_PAUSE', uuid))
    },

    async handleClearAll ({ commit }) {
      const res = await DownApi.handleClearAll()
      if (res) commit('DOWN_CLEAR_ALL')
      else message.error('清除失败')
    },

    async handleGetDownHistoryList ({ commit }) {
      const res = await DownApi.handleGetDownHistoryList()
      console.log('下载记录', res)
      if (res) commit('GET_DOWN_HISTORY', res)
      else message.error('查询失败')
    },
    testDown ({ dispatch }) {
      // const a = 'https://freetyst.nf.migu.cn/public/product9th/product42/2021/01/2612/2009年06月26日博尔普斯/歌曲下载/MP3_40_16_Stero/60054701938124543.mp3?key=49979f81e373c100&Tim=1619349468395&channelid=00&msisdn=e5582e73d8eb4ee2a1cee25e508c6ebb&CI=600547019382600902000006889306&F=000009'
      // const c = 'https://cloud-dev.cdn-qn.hzmantu.com/upload_dev/2020/06/17/ljlYFjMmWelwE0Jc-Ts6m-OUJEV3.jpg'

      // const b = 'https://cloud-dev.cdn-qn.hzmantu.com/upload_dev/2021/04/21/lr2fd1oOvlUlyMH3C0woCEXba27M.jpg'
      // const d = 'https://cloud-dev.cdn-qn.hzmantu.com/upload_dev/2020/06/17/lkLb5AfrSqhmamZTsZ_XqzFDnSdv.jpg'
      const d = 'https://download.jetbrains.com.cn/webstorm/WebStorm-2021.1.1.dmg'
      // const e = 'http://m701.music.126.net/20210511180820/520024b402e3943bfc2aaf19729b1b47/jdyyaac/0509/0158/065e/2c9b88ed8362529464e214ad79aeed7c.m4a'
      const list = [
        // {
        //   url: a,
        //   type: '.mp3'
        // },
        // {
        //   url: a,
        //   type: '.mp3'
        // },
        // {
        //   url: c,
        //   type: 'img'
        // },
        {
          url: d,
          type: 'img'
        }
        // {
        //   url: e,
        //   type: 'mp3'
        // }
      ]
      dispatch('batchAddDownFileTask', list)
    }
  }
}

export default globalDownModule
