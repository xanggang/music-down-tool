<template>
  <div>
    <button @click="handleSendIpc"> 发送Ipc消息， 打开文件选择窗口</button>
    <button @click="handleSelectLocalPath">选择本地音乐文件夹</button>
    <div style="width: 100%;height: 400px;display: flex; align-items: center; justify-content: center">
      <audio :src="'local:/' + src" controls="controls">
        您的浏览器不支持 audio 标签。
      </audio>
    </div>
    <downManager />
    <button @click="handleDown">下载</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as IpcEnums from '@/electorn/ipc/enums'
import { useStore } from '@/web/store'
import DownManager from '@/web/components/downManager/index.vue'

const { ipcRenderer } = window.require('electron')

export default defineComponent({
  name: 'Home',
  components: { DownManager },
  setup () {
    const a = 'https://freetyst.nf.migu.cn/public/product9th/product42/2021/01/2612/2009年06月26日博尔普斯/歌曲下载/MP3_40_16_Stero/60054701938124543.mp3?key=49979f81e373c100&Tim=1619349468395&channelid=00&msisdn=e5582e73d8eb4ee2a1cee25e508c6ebb&CI=600547019382600902000006889306&F=000009'

    const b = 'https://freetyst.nf.migu.cn/public/product9th/product41/2020/08/1013/2009年06月26日博尔普斯/歌曲下载/MP3_40_16_Stero/60054701958132127.mp3?key=a0eac0db2cae9dcd&Tim=1619349469341&channelid=00&msisdn=c78da90973ad4102aa20bba0b3debd13&CI=600547019582600902000006889222&F=000009'
    const list = [
      {
        url: a,
        type: '.mp3'
      },
      {
        url: b,
        type: '.mp3'
      }
    ]
    const store = useStore()
    return {
      handleDown: () => store.dispatch('down/batchDownFiles', list)
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
