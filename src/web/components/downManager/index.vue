<template>
  <div class="down-manager">
    <div class="title-nav">
      <a-row>
        <a-col :span="10"><div class="text">下载内容</div></a-col>
        <a-col :span="10"><div class="text">下载状态</div></a-col>
        <a-col :span="2"><div class="text">操作</div></a-col>
        <a-col :span="2"><div class="text">删除</div></a-col>
      </a-row>
    </div>
    <div class="downing-item-container">
      <downItem v-for="(item, index) in waitDownloadList" :downItem="item" :key="'waitDownloadList' + index"></downItem>
      <downItem v-for="(item, index) in downList" :downItem="item" :key="'waitDownloadList' + index"></downItem>
      <downItem v-for="(item, index) in downedList" :downItem="item" :key="'waitDownloadList' + index"></downItem>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/web/store'
import DownItem from './downItem.vue'

export default defineComponent({
  name: 'DownManagerMain',
  components: { DownItem },
  setup () {
    const store = useStore()
    const waitDownloadList = computed(() => store.state.down.waitDownloadList)
    const downList = computed(() => store.state.down.downloadingList)
    const downedList = computed(() => store.state.down.downloadList)

    return {
      waitDownloadList,
      downList,
      downedList
    }
  }
})
</script>

<style scoped lang="less">
.down-manager {
  width: 600px;
  height: 200px;
  padding: 20px;
  border-radius: 5px;
  background: #fff;

  .title-nav {
    background: #f5f7fb;
    padding: 8px 0;
    color: #bbc1c8;

    .text {
      width: 100%;
      margin-left: 10px;
      text-align: left;
    }
  }
}
</style>
