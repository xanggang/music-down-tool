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
            <PauseCircleOutlined v-if="state === 'progressing' && !downItem.process.canResume" @click="handlePause"/>
            <PlayCircleOutlined v-if="downItem.process.canResume" @click="handleResume"/>
          </div></div>
      </a-col>
      <a-col :span="2">
        <div class="col-container">
          <div class="icon-bar">
            <CloseCircleOutlined v-if="state === 'progressing'" @click="handleCancel"/>
            <CloseCircleOutlined v-if="state === 'completed' || state === 'cancelled'" @click="handleDelete"/>
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
  PauseCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { IWebDownItemType } from '@/types/downTypes'
import * as IpcEnums from '@/electorn/ipc/enums'
import { useStore } from '@/web/store'
const { ipcRenderer } = window.require('electron')

export default defineComponent({
  name: 'downItem',
  components: { VerticalAlignBottomOutlined, ZoomInOutlined, CloseCircleOutlined, InfoCircleOutlined, PauseCircleOutlined, PlayCircleOutlined },
  props: {
    downItem: {
      type: Object as PropType<IWebDownItemType>,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const state = computed(() => props.downItem.itemInfo.state)
    const iconSrc = computed(() => props.downItem.itemInfo.icon)
    const uuid = computed(() => props.downItem.itemInfo.uuid)

    const filterDownState = (state: 'waitdown' | 'progressing' | 'completed') => {
      const map = {
        waitdown: '等待下载',
        progressing: '下载中',
        completed: '下载完成'
      }
      return map[state] as string
    }

    // 打开文件所在目录
    const handleOpenFileFolder = () => {
      const res = ipcRenderer.sendSync(IpcEnums.V_OPEN_FOLDER, props.downItem.itemInfo.savePath)
      if (res === 'failed') message.error('文件夹不存在')
    }

    // 暂停下载
    const handlePause = () => {
      store.dispatch('down/handleDownPause', uuid.value)
    }

    // 继续下载
    const handleResume = () => {
      store.dispatch('down/handleDownResume', uuid.value)
    }

    // 删除下载任务
    const handleDelete = () => {
      store.dispatch('down/handleDownDelete', uuid.value)
    }

    // 取消下载
    const handleCancel = () => {
      store.dispatch('down/handleDownCancel', uuid.value)
    }

    return {
      state,
      iconSrc,
      filterDownState,
      handleOpenFileFolder,
      handlePause,
      handleResume,
      handleDelete,
      handleCancel
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
