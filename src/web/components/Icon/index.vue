<template>
  <span v-on="bindMouseEvent" class="icon-container">
    <svg class="icon menu-item-icon" aria-hidden="true" v-if="isActive">
      <use :xlink:href="`#${icon}`"></use>
    </svg>
    <span :class="['iconfont', `${icon}`]" v-else></span>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import useHover from '@/web/use/useHover'

export default defineComponent({
  name: 'Icon',
  props: {
    icon: String,
    active: Boolean,
    needHover: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const { hover, bindMouseEvent } = useHover()
    const isActive = computed(() => {
      return (hover.value && props.needHover) || props.active
    })

    return {
      bindMouseEvent,
      isActive
    }
  }
})
</script>

<style scoped lang="less">
@import '~@/web/style/palette.less';

.icon-container {
  cursor: pointer;
}

.menu-item-icon {
  //box-shadow: 0 0 10px @light-primary-color, 0 0 5px @default-primary-color;
  cursor: pointer;
}

.iconfont {
  font-size: unset;
}
</style>
