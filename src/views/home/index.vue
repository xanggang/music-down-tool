<template>
  <div>
    <h1>这里是首页</h1>
    <input type="file" id="selectFiles" multiple @change="handleChangeInput">
    <img :src=" src" alt="">
    <button @click="handleSendIpc"> 发送Ipc消息1</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
      return 8
    }
  }
})
</script>

<style scoped>

</style>
