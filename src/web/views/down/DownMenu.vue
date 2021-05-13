<template>
  <div class="down-menu-main">
    <div class="down-menu-title">
      任务列表
    </div>
    <div class="down-menu-item-wrap">
      <div
        class="down-menu-item"
        v-for="(item, index) in menuList"
        @click="handleLink(item, index)"
        :key="item.name"
      >
        <div class="down-icon-wrap">
          <Icon :icon="item.icon" :active="activeIndex === index"></Icon>
        </div>
        <span>{{ item.name }}</span>
      </div>
      <div class="down-menu-item down-mask" :style="{ top: maskTop }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import Icon from '@/web/components/Icon/index.vue'

export default defineComponent({
  name: 'DownMenu',
  components: { Icon },
  setup () {
    const menuList = [
      {
        name: '下载中',
        icon: 'icon-kuaijin-'
      },
      {
        name: '等待中',
        icon: 'icon-zanting-1'
      },
      {
        name: '已停止',
        icon: 'icon-dianshiju-'
      }
    ]
    const state = reactive({
      active: 'index',
      activeIndex: 0,
      menuList
    })
    const maskTop = computed(() => state.activeIndex * (50) + 10 + 'px')

    const handleLink = (item: any, index: number) => {
      state.activeIndex = index
    }

    return {
      ...toRefs(state),
      maskTop,
      handleLink
    }
  }
})
</script>

<style scoped lang="less">
@import '~@/web/style/palette.less';
.down-menu-main {
  width: 120px;
  height: 100%;
  padding-top: 40px;
  background: @background-color-base;

  .down-menu-title {
    height: 40px;
    padding-left: 15px;
    width: 100%;
    margin-bottom: 20px;
    font-size: 16px;
    color: @primary-text-color;
    text-align: left;
    line-height: 40px;
  }

  .down-menu-item-wrap {
    position: relative;

    .down-menu-item {
      height: 50px;
      width: 100%;
      color: @secondary-text-color;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      z-index: 2;

      &.active {
        background: #fff;
      }

      .down-icon-wrap {
        width: 20px;
        margin-right: 10px;
        font-size: 18px;
      }

      //.menu-item-icon {
      //  box-shadow: 0 0 10px @light-primary-color, 0 0 5px @default-primary-color;
      //}
    }

    .down-mask {
      width: 100px;
      height: 30px;
      position: absolute;
      z-index: 1;
      left: 10px;
      top: 0;
      background: #DDDEDEFF;
    }
  }
}
</style>
