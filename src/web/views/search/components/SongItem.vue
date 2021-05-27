<template>
  <div :class="['song-item-item', { active: hover }]" v-on="bindMouseEvent">
    <a-row :gutter="10">
      <a-col :span="10">
        <div class="col-wrap between">
          <div :class="['name', {'is-unfold': hover }]"> {{ song.name }} </div>
          <div class="operating-wrap" v-show="hover">
            <Icon :need-hover="true" icon="icon-xiazai1" @click="$emit('down-song', song)"></Icon>
            <Icon :need-hover="true" icon="icon-shoucang"></Icon>
            <Icon :need-hover="true" icon="icon-bofang-"></Icon>
          </div>
        </div>
      </a-col>
      <a-col :span="5"><div class="col-wrap">{{ song.artist }}</div></a-col>
      <a-col :span="5"><div class="col-wrap">{{ song.album }}</div></a-col>
      <a-col :span="4"><div class="col-wrap">{{ useVendorToCn(song.vendor) }}</div></a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { ISongListInfoTypes } from '@/types/playListTypes'
import useHover from '@/web/use/useHover'
import { useVendorToCn } from '@/web/use/toCn'
import Icon from '@/web/components/Icon/index.vue'

export default defineComponent({
  name: 'SongItem',
  components: { Icon },
  props: {
    song: {
      type: Object as PropType<ISongListInfoTypes>
    }
  },
  setup () {
    const { hover, bindMouseEvent } = useHover()

    return {
      hover,
      bindMouseEvent,
      useVendorToCn
    }
  }
})
</script>

<style scoped lang="less">
@import '~@/web/style/palette.less';
.song-item-item {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 14px;
  color: @primary-text-color;
  transition: all 0.2s;

  & > div {
    width: 100%;
  }

  &.active {
    background: @background-color-base;
  }

  .col-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100%;

    &.between {
      justify-content: space-between;
    }

    & > div {
      flex-shrink: 0;
    }
  }

  .name {
    width: 100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: left;

    &.is-unfold {
      width: 120px;
    }
  }

  .operating-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100px;
    font-size: 16px;

    & > span {
      margin-right: 10px;
    }
  }
}
</style>
