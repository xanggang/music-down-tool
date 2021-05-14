<template>
  <div class="song-list">
    <div class="song-table-header">
      <div class="song-name">歌名</div>
      <div class="song-artists">歌手</div>
      <div class="song-album">专辑</div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SongList'
})
</script>

<style scoped lang="less">
@import '~@/web/style/palette.less';
.song-list {
  width: 100%;
  height: 100%;

  .song-table-header {
    width: 100%;
    display: flex;
    height: 40px;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    color: @primary-text-color;

    & > div {
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
}
</style>
