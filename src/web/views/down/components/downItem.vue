<template>
  <div class="down-item-container" v-on="bindMouseEvent">
    <div class="down-item-operating">
      <div :class="['name', {'is-unfold': hover }]">
        {{ downItem.fileName }}
      </div>
      <div :class="['operating-wrap', {'active': hoverItem }]" v-on="bindItemMouseEvent">
        <Icon
          v-show="state === 'progressing' && downItem.canResume && downItem.isUserPause"
          icon="icon-bofang1"
          @click="handleDownResume(downItem.uuid)"
        />
        <Icon
          v-show="state === 'progressing' && !downItem.isUserPause"
          icon="icon-zanting1"
          @click="handleDownPause(downItem.uuid)"
        />
        <!--        正在进行中， 直接取消任务-->
        <Icon
          v-show="['waitdown', 'progressing', 'interrupted'].includes(state)"
          icon="icon-shanchu1"
          @click="handleDownCancel(downItem.uuid)"
        />
        <!--        任务已经完成， 删除任务-->
        <Icon
          v-show="state === 'cancelled' || state === 'completed'"
          icon="icon-shanchu1"
          @click="handleDeleteHistory(downItem.uuid)"
        />
        <Icon
          v-show="state === 'completed'"
          icon="icon-wenjianjia1"
          @click="handleOpenFileFolder"
        />
        <Icon
          icon="icon-lianjie"
          @click="handleCopyLink"
        />
      </div>
    </div>
    <a-progress
      :percent="progressStatus === 'success' ? 100 : downItem.progressInfo.progress"
      :status="progressStatus"
      :show-info="false"
      :stroke-color="{
        '0%': '#4CAF50',
        '100%': '#009688',
      }"
    />
    <div class="progress-info">
      <span v-show="state === 'progressing'">{{ downItem.progressInfo.speed }} / </span>
      <span v-show="state === 'completed'">{{ downItem.total }} / </span>
      <span>total: {{  downItem.total }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import useHover from '@/web/use/useHover'
import { computed, defineComponent, PropType, inject } from 'vue'
import { useVendorToCn } from '@/web/use/toCn'
import Icon from '@/web/components/Icon/index.vue'
import { IDownItemOptions } from '@/types/downTypes1'
import Api from '@/electorn/enums/ApiEnums'
import { message } from 'ant-design-vue'
import { useClipboard } from '@vueuse/core'
import type { WebDownManager } from '@/web/util/downManager'
const { ipcRenderer } = window.require('electron')

export default defineComponent({
  name: 'DownItem',
  components: { Icon },
  props: {
    downItem: {
      type: Object as PropType<IDownItemOptions>,
      required: true
    }
  },
  setup (props) {
    const { hover, bindMouseEvent } = useHover()
    const { hover: hoverItem, bindMouseEvent: bindItemMouseEvent } = useHover()

    const state = computed(() => props.downItem.state)
    const iconSrc = computed(() => props.downItem.icon || '')

    const progressStatus = computed(() => {
      if (state.value === 'progressing') return 'active'
      if (state.value === 'completed') return 'success'
      return 'normal'
    })

    const downManager = inject('downManager') as WebDownManager

    const {
      handleDownPause,
      handleDownResume,
      handleDownCancel,
      handleDeleteHistory
    } = downManager

    // 打开文件所在目录
    const handleOpenFileFolder = () => {
      const res = ipcRenderer.sendSync(Api.ToolApi.V_OPEN_FOLDER, props.downItem.savePath)
      if (res === 'failed') message.error('文件夹不存在')
    }

    const { copy } = useClipboard()
    const handleCopyLink = () => {
      copy(props.downItem.downURL)
      message.success('复制成功')
    }

    return {
      hover,
      bindMouseEvent,
      hoverItem,
      bindItemMouseEvent,
      useVendorToCn,

      state,
      iconSrc,
      progressStatus,

      handleOpenFileFolder,
      handleDownPause: handleDownPause.bind(downManager),
      handleDownResume: handleDownResume.bind(downManager),
      handleDownCancel: handleDownCancel.bind(downManager),
      handleDeleteHistory: handleDeleteHistory.bind(downManager),
      handleCopyLink
    }
  }
})

</script>

<style scoped lang="less">
@import '~@/web/style/palette.less';
.down-item-container {
  width: 100%;
  padding: 10px;
  background: @background-color-base;
  box-sizing: border-box;
  transition: all 0.2s;
  border: 1px solid rgba(117, 117, 117, 0.36);
  margin-bottom: 10px;

  &:hover {
    border-color: @accent-color;
    box-shadow: 0 0 10px @light-primary-color, 0 0 5px @default-primary-color;
  }

  .down-item-operating {
    width: 100%;
    display: flex;
    justify-content: space-between;

    & > div {
      flex-shrink: 0;
    }

    .name {
      max-width: 80%;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      text-align: left;
    }

    .operating-wrap {
      height: 26px;
      padding: 0 20px;
      border-radius: 15px;
      border: 1px solid @divider-color;
      transition: all 0.5s;
      font-size: 16px;
      line-height: 26px;
      color: @divider-color;

      &.active {
        background:#009688 ;
        border-color: @default-primary-color;
        color: #fff;
      }

      & > span {
        margin-right: 10px;
      }
    }
  }

  .progress-info {
    text-align: right;
    font-size: 12px;
    color: @secondary-text-color;
  }
}
</style>
