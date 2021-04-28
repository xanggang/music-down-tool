<template>
  <div class="downing-manager-item">
    <a-row class="row-item">
      <a-col :span="10">
        <div class="col-container">
          <div class="image-bar">
            <img :src="iconSrc || '../../../assets/logo.png'" alt="">
          </div>
          <div class="file-name">{{ downItem.itemInfo.fileName }}</div>
        </div>
      </a-col>
      <a-col :span="10">
        <div class="col-container" v-if="state !== 'progressing'">
          <InfoCircleOutlined v-if="state === 'waitdown'"/>
          <VerticalAlignBottomOutlined v-if="state === 'completed'"/>
          <span class="ml-10"> {{ filterDownState(state) }} </span>
        </div>
        <div class="col-container" v-else>
          <a-progress :percent="downItem.process.progress" />
          <div class="description">{{ downItem.process.speed }}</div>3
        </div>
      </a-col>
      <a-col :span="2">
        <div class="col-container">
          <div class="icon-bar">
            <ZoomInOutlined v-if="state === 'completed' " @click="handleOpenFileFolder" />
            <PauseCircleOutlined v-if="state === 'progressing'"/>
          </div></div>
      </a-col>
      <a-col :span="2">
        <div class="col-container">
          <div class="icon-bar">
            <CloseCircleOutlined />
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import {
  VerticalAlignBottomOutlined,
  ZoomInOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { IWebDownItemType } from '@/types/downTypes'
import * as IpcEnums from '@/electorn/ipc/enums'
const { ipcRenderer } = window.require('electron')

export default defineComponent({
  name: 'downItem',
  components: { VerticalAlignBottomOutlined, ZoomInOutlined, CloseCircleOutlined, InfoCircleOutlined, PauseCircleOutlined },
  props: {
    downItem: {
      type: Object as PropType<IWebDownItemType>,
      required: true
    }
  },
  setup (props) {
    const state = computed(() => props.downItem.itemInfo.state)
    const iconSrc = computed(() => props.downItem.itemInfo.icon)

    const filterDownState = (state: 'waitdown' | 'progressing' | 'completed') => {
      const map = {
        waitdown: '等待下载',
        progressing: '下载中',
        completed: '下载完成'
      }
      return map[state] as string
    }

    const handleOpenFileFolder = () => {
      const res = ipcRenderer.sendSync(IpcEnums.V_OPEN_FOLDER, props.downItem.itemInfo.savePath)
      if (res === 'failed') message.error('文件夹不存在')
    }

    return {
      state,
      iconSrc,
      filterDownState,
      handleOpenFileFolder
    }
  }
})
</script>

<style scoped lang="less">
.downing-manager-item {

  .row-item {
    padding: 8px 0;
    color: #606266;

    .col-container {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 8px;
      flex-wrap: wrap;

      .file-name {
        width: calc(100% - 50px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .icon-bar {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #DCDFE6;
        border-radius: 3px;
        color: #606266;
      }

      .image-bar {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.ml-10 {
  margin-left: 10px;
}
</style>
