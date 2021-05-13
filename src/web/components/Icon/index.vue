<template>
  <svg class="icon menu-item-icon" aria-hidden="true" v-if="active">
    <use :xlink:href="`#${icon}`"></use>
  </svg>
  <span :class="['iconfont', `${icon}`]" v-else></span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Icon',
  props: {
    icon: String,
    active: Boolean
  }
})
</script>

<style scoped lang="less">
@import '~@/web/style/palette.less';

.menu-item-icon {
  box-shadow: 0 0 10px @light-primary-color, 0 0 5px @default-primary-color;
}
</style>
