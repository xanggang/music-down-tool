<template>
  <div class="plate-wrap">
    <div>
      <div class="img-wrap">
        <img src="../../assets/img/no-data.svg" alt="">
      </div>
      <div class="msg">没有搜索结果哦</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PlateMain'
})
</script>

<style scoped lang="less">
@import '~@/web/style/palette.less';

.plate-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;

  .img-wrap {
    width: 200px;
    height: 200px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .msg {
    font-size: 14px;
    color: @secondary-text-color;
  }
}
</style>
