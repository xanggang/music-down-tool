<template>
  <div class="layer-menu">
    <div class="logo">
      <img src="../../../assets/img/logo.png" alt="">
    </div>
    <div class="menu-item-wrap">
      <div
        class="menu-item"
        v-for="(item, index) in menuList"
        :key="item.name"
        @click="handleLink(item, index)"
      >
        <Icon :icon="item.icon" :active="active === item.name"></Icon>
      </div>
      <div class="menu-item mask" :style="{ top: maskTop }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from 'vue'
import Icon from '@/web/components/Icon/index.vue'

export default defineComponent({
  name: 'LayerMenu',
  components: { Icon },
  setup () {
    const menuList = [
      {
        name: 'index',
        path: '/index',
        icon: 'icon-xiangji'
      },
      {
        name: 'about',
        path: '/about',
        icon: 'icon-yinleku'
      }
    ]

    const state = reactive({
      menuList,
      active: 'index',
      activeIndex: 0
    })

    const handleLink = (item: any, index: number) => {
      state.active = item.name
      state.activeIndex = index
    }

    const maskTop = computed(() => state.activeIndex * 50 + 'px')

    return {
      ...toRefs(state),
      handleLink,
      maskTop
    }
  }
})
</script>
