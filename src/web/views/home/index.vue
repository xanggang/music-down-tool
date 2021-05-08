<template>
  <div>
    <Progress  style="width: 50px; height: 50px; margin-left: 100px"/>
    <button @click="handleSendIpc"> 发送Ipc消息， 打开文件选择窗口</button>
    <button @click="handleSelectLocalPath">选择本地音乐文件夹</button>
    <div style="width: 100%;height: 400px;display: flex; align-items: center; justify-content: center">
      <audio :src="'local:/' + src" controls="controls">
        您的浏览器不支持 audio 标签。
      </audio>
    </div>
    <downManager/>
    <button @click="handleDown">下载</button>
    <button @click="openFile">读取文件</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as IpcEnums from '@/electorn/ipc/enums'
import { useStore } from '@/web/store'
import DownManager from '@/web/components/downManager/index.vue'
import Progress from '@/web/components/Progress/index.vue'

const { ipcRenderer } = window.require('electron')

export default defineComponent({
  name: 'Home',
  components: { DownManager, Progress },
  setup () {
    const a = 'https://freetyst.nf.migu.cn/public/product9th/product42/2021/01/2612/2009年06月26日博尔普斯/歌曲下载/MP3_40_16_Stero/60054701938124543.mp3?key=49979f81e373c100&Tim=1619349468395&channelid=00&msisdn=e5582e73d8eb4ee2a1cee25e508c6ebb&CI=600547019382600902000006889306&F=000009'
    const c = 'https://cloud-dev.cdn-qn.hzmantu.com/upload_dev/2020/06/17/ljlYFjMmWelwE0Jc-Ts6m-OUJEV3.jpg'

    const b = 'https://cloud-dev.cdn-qn.hzmantu.com/upload_dev/2021/04/21/lr2fd1oOvlUlyMH3C0woCEXba27M.jpg'
    const d = 'https://cloud-dev.cdn-qn.hzmantu.com/upload_dev/2020/06/17/lkLb5AfrSqhmamZTsZ_XqzFDnSdv.jpg'
    const list = [
      {
        url: a,
        type: '.mp3'
      },
      {
        url: b,
        type: '.mp3'
      },
      {
        url: c,
        type: 'img'
      },
      {
        url: d,
        type: 'img'
      }
    ]
    const store = useStore()

    const openFile = () => {
      const configString = ipcRenderer.sendSync(IpcEnums.V_OPEN_SINGLE_FILE)
      if (!configString) return
      try {
        const config = JSON.parse(configString)
        const downConfig: any = []
        config.forEach((item: any) => {
          if (item.playUrl) {
            downConfig.push({
              songId: item.songId,
              songName: item.songName,
              url: 'https://' + item.playUrl,
              type: 'music'
            })
          }
          if (item.largePic) {
            downConfig.push({
              songId: item.songId,
              songName: item.songName,
              url: 'https://' + item.largePic,
              type: 'img'
            })
          }
          if (item.smallPic) {
            downConfig.push({
              songId: item.songId,
              songName: item.songName,
              url: 'https://' + item.smallPic,
              type: 'img'
            })
          }
        })
        store.dispatch('down/batchAddDownFileTask', downConfig)
      } catch (e) {
        console.log(e)
      }
    }

    return {
      handleDown: () => store.dispatch('down/batchAddDownFileTask', list),
      openFile
    }
  },
  data () {
    return {
      src: ''
    }
  },
  methods: {
    handleChangeInput (event: any) {
      const files = event.target.files
      this.src = files[0].path
    },
    handleSendIpc () {
      const path = ipcRenderer.sendSync(IpcEnums.V_SAVE_PATH_DIALOG)
      console.log(path)
    },
    getMusicPath () {
      return ''
    },
    handleSelectLocalPath () {
      const path = ipcRenderer.sendSync(IpcEnums.V_SAVE_PATH_DIALOG)
      if (!path) return
      if (path.length) {
        console.log(path[0])
        const list = ipcRenderer.sendSync(IpcEnums.V_GET_DIR_FILE_LIST, path[0])
        if (list.length) {
          this.src = list[0].filePath
        }
      }
    }
  }
})
</script>

<style scoped>

</style>
