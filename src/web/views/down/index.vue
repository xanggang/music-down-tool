<template>
  <div class="down-manager-main">
    <DownMenu  v-model="downState"/>
    <div class="down-manager-container">
      <div class="title-wrap">
        <div class="title">
          {{ filterDownState(downState) }}
        </div>
        <div class="operating-wrap">
          <a-tooltip color="#00796B" title="全部开始" @click="testDown">
            <Icon icon="icon-bofang1" />
          </a-tooltip>

          <a-tooltip color="#00796B" title="全部暂停">
            <Icon icon="icon-zanting1" @click="handlePauseAll" />
          </a-tooltip>

          <a-tooltip color="#00796B" title="清空记录">
            <Icon icon="icon-qingkong" @click="handleClearAll"/>
          </a-tooltip>
        </div>
      </div>
      <div class="down-wrap">
        <DownItem v-for="item in downInfoList" :down-item="item" :key="item"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from 'vue'
import DownMenu from './DownMenu.vue'
import DownItem from './components/downItem.vue'
import Icon from '@/web/components/Icon/index.vue'
import { useStore } from '@/web/store'

export default defineComponent({
  name: 'downManagerMain',
  components: { DownMenu, DownItem, Icon },
  setup () {
    const downState = ref('downing')

    const store = useStore()
    const waitDownloadList = computed(() => store.state.down.waitDownloadList)
    const downloadingList = computed(() => store.state.down.downloadingList)
    const downloadList = computed(() => store.state.down.downloadList)

    const downInfoList = computed(() => {
      if (downState.value === 'downing') return downloadingList.value
      if (downState.value === 'padding') return waitDownloadList.value
      if (downState.value === 'complete') return downloadList.value
      return []
    })

    const testDown = () => {
      store.dispatch('down/testDown')
    }

    onMounted(() => {
      store.dispatch('down/handleGetDownHistoryList')
    })

    // 暂停全部下载
    const handlePauseAll = () => {
      store.dispatch('down/handlePauseAll')
    }

    // 清除
    const handleClearAll = () => {
      store.dispatch('down/handleClearAll')
    }

    return {
      downloadingList,
      downState,
      downInfoList,
      testDown,
      filterDownState,
      handlePauseAll,
      handleClearAll
    }
  }
})

const filterDownState = (state: 'padding' | 'downing' | 'complete') => {
  const map = {
    padding: '等待下载',
    downing: '下载中',
    complete: '下载完成'
  }
  return map[state] as string
}

</script>

<style scoped lang="less">
@import '~@/web/style/palette.less';
.down-manager-main {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  width: 100%;

  & > div {
    flex-shrink: 0;
  }

  .down-manager-container {
    width: calc(100% - 140px);
    height: 100%;

    .title-wrap {
      width: 100%;
      border-bottom: 1px solid @divider-color;
      text-align: left;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;

      & > div {
        flex-shrink: 1;
      }

      .title {

      }

      .operating-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        color: @secondary-text-color;
        font-size: 20px;

        & > span {
          margin-right: 15px;

          & > span {
            font-size: 20px !important;
          }
        }
      }
    }

    .down-wrap {
      width: 100%;
      height: calc(100% - 34px);
      overflow-y: auto;
      padding-right: 10px;
    }
  }
}
</style>
