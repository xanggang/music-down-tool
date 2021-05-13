<template>
  <div class="down-manager-main">
    <DownMenu></DownMenu>
    <div class="down-manager-container">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DownMenu from './DownMenu.vue'

export default defineComponent({
  name: 'downManagerMain',
  components: { DownMenu }
})
</script>

<style scoped lang="less">
@import '~@/web/style/palette.less';
.down-manager-main {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
}
</style>
