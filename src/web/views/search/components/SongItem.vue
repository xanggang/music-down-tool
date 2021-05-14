<template>
  <div :class="['song-item-item', { active: hover }]" v-on="bindMouseEvent">
    <div class="song-name">{{ song.name }}</div>
    <div class="song-artists">{{ song.artist }}</div>
    <div class="song-album">{{ song.album }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { ISongListInfoTypes } from '@/types/playListTypes'
import useHover from '@/web/use/useHover'

export default defineComponent({
  name: 'SongItem',
  props: {
    song: {
      type: Object as PropType<ISongListInfoTypes>
    }
  },
  setup () {
    const { hover, bindMouseEvent } = useHover()

    return {
      hover,
      bindMouseEvent
    }
  }
})
</script>

<style scoped lang="less">
@import '~@/web/style/palette.less';
.song-item-item {
  width: 100%;
  display: flex;
  height: 50px;
  align-items: center;
  padding: 0 10px;
  font-size: 14px;
  color: @primary-text-color;
  transition: all 0.2s;

  & > div {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  &.active {
    background: @background-color-base;
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
</style>
