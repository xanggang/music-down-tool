<template>
  <div>
    <h1>这里是首页</h1>
    <input type="file" id="selectFiles" multiple @change="handleChangeInput">
    <img :src=" src" alt="">
    <button @click="handleSendIpc"> 发送Ipc消息， 打开文件选择窗口</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as IpcEnums from '@/electorn/ipc/enums1'
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
      ipcRenderer.sendSync(IpcEnums.SAVE_PATH_DIALOG)
    }
  }
})
</script>

<style scoped>

</style>
