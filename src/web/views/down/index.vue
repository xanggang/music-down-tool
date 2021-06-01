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
      <div class="bottom-tool">
        <div @click="handleOpenSettingView">
          <span>下载地址:</span>
          <span>{{ downDir }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, provide } from 'vue'
import DownMenu from './DownMenu.vue'
import DownItem from './components/downItem.vue'
import Icon from '@/web/components/Icon/index.vue'
import getDownManager from '@/web/util/downManager'
import { useStore } from '@/web/store'
import Api from '@/electorn/enums/ApiEnums'
const { ipcRenderer } = window.require('electron')

export default defineComponent({
  name: 'downManagerMain',
  components: { DownMenu, DownItem, Icon },
  setup () {
    const downManager = getDownManager()
    provide('downManager', downManager)

    const {
      downHistoryList,
      downloadState,
      waitDownloadList,
      handlePauseAll,
      handleClearAll,
      testDown
    } = downManager

    const downState = ref('downing')

    const downInfoList = computed(() => {
      if (downState.value === 'downing') return Object.values(downloadState.value)
      if (downState.value === 'padding') return waitDownloadList.value
      if (downState.value === 'complete') return downHistoryList.value
      return []
    })

    const store = useStore()
    const downDir = computed(() => store.state.setting.sysSetting)
    const handleOpenSettingView = () => {
      const res = ipcRenderer.sendSync(Api.ConfigApi.V_CHANGE_DOWN_DIR)
      console.log({ res })
    }

    return {
      downState,
      downInfoList,
      testDown: testDown.bind(downManager),
      filterDownState,
      handlePauseAll: handlePauseAll.bind(downManager),
      handleClearAll: handleClearAll.bind(downManager),

      handleOpenSettingView,
      downDir
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
      height: calc(100% - 54px);
      overflow-y: auto;
      padding-right: 10px;
    }
  }

  .bottom-tool {
    width: 100%;
    height: 20px;
    bottom: 0;
    display: flex;
    align-content: center;
    justify-content: flex-end;
    font-size: 14px;
    color: @divider-color;

    & > {
      cursor: pointer;
    }
  }
}
</style>
