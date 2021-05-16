<template>
  <div class="song-list">
    <div :class="['song-table-header', { 'has-scroll': hasScroll }]">
      <a-row :gutter="10">
        <a-col :span="10"><div class="col-wrap">歌名</div></a-col>
        <a-col :span="5"><div class="col-wrap">歌手</div></a-col>
        <a-col :span="5"><div class="col-wrap">专辑</div></a-col>
        <a-col :span="4"><div class="col-wrap">来源</div></a-col>
      </a-row>
    </div>
    <div class="scroll-wrap" ref="scrollContainer">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useScroll from '@/web/use/useScroll'

export default defineComponent({
  name: 'SongList',
  setup () {
    const { scrollContainer, hasScroll } = useScroll()

    return {
      scrollContainer,
      hasScroll
    }
  }
})
</script>

<style scoped lang="less">
@import '~@/web/style/palette.less';
.song-list {
  width: 100%;
  height: 100%;

  .song-table-header {
    width: 100%;
    height: 40px;
    padding: 0 10px;
    font-size: 14px;
    color: @primary-text-color;

    & > div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
    }

    &.has-scroll {
      margin-left: -8px;
    }

    .col-wrap {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .song-name {
      width: 40%;
    }

    .song-artists {
      width: 30%;
    }

    .song-album {
      width: 30%;
    }
  }

  .scroll-wrap {
    height: calc(100% - 48px);
    overflow: auto;
  }
}
</style>
