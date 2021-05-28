<template>
  <div class="down-item-container" v-on="bindMouseEvent">
    <div class="down-item-operating">
      <div :class="['name', {'is-unfold': hover }]">
        {{ downItem.fileName }}
      </div>
      <div :class="['operating-wrap', {'active': hoverItem }]" v-on="bindItemMouseEvent">
        <Icon icon="icon-bofang1" @click="handleDownResume" />
        <Icon icon="icon-zanting1" @click="handleDownPause" />
        <Icon icon="icon-shanchu1" @click="handleDownDelete"/>
        <Icon icon="icon-wenjianjia1" @click="handleOpenFileFolder"/>
        <Icon icon="icon-wenjianjia1" @click="handleDownCancel"/>
        <!-- todo 复制链接 <Icon icon="icon-lianjie" />-->
      </div>
    </div>
    <a-progress
      :percent="downItem.progressInfo.progress"
      :status="progressStatus"
      :show-info="false"
      :stroke-color="{
        '0%': '#4CAF50',
        '100%': '#009688',
      }"
    />
    <div class="progress-info">
      <span>{{ downItem.progressInfo.speed }} / </span>
      <span>total: {{ downItem.progressInfo.total }}</span>
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
      handleDownDelete,
      handleDownCancel
    } = downManager

    // 打开文件所在目录
    const handleOpenFileFolder = () => {
      const res = ipcRenderer.sendSync(Api.ToolApi.V_OPEN_FOLDER, props.downItem.savePath)
      if (res === 'failed') message.error('文件夹不存在')
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
      handleDownPause,
      handleDownResume,
      handleDownDelete,
      handleDownCancel
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
