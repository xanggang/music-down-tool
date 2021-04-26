<template>
  <div>
    <button @click="handleSendIpc"> 发送Ipc消息， 打开文件选择窗口</button>
    <button @click="handleSelectLocalPath">选择本地音乐文件夹</button>
    <div style="width: 100%;height: 400px;display: flex; align-items: center; justify-content: center">
      <audio :src="'local:/' + src" controls="controls">
        您的浏览器不支持 audio 标签。
      </audio>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as IpcEnums from '@/electorn/ipc/enums'
const { ipcRenderer } = window.require('electron')

export default defineComponent({
  name: 'Home',
  components: { },
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
