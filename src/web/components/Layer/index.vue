<template>
  <div class="layer-main">
    <div class="layer-header">
      <div class="left"></div>
    </div>
    <div class="layer-container">
      <Menu></Menu>
      <wave>
        <div class="layer-router-container">
          <router-view/>
        </div>
      </wave>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Menu from './Menu.vue'
// import wave from '../../views/music/index.vue'
import wave from './bg.vue'
export default defineComponent({
  name: 'LayerIndex',
  components: { Menu, wave }
})
</script>

<style lang="less">
@import '~@/web/style/palette.less';
.layer-main {
  width: 100%;
  height: 100%;

  .layer-header {
    height: 20px;
    width: 100%;
    -webkit-app-region: drag;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    .left {
      width: 80px;
      height: 100%;
      background: @dark-primary-color;
    }
  }
  .layer-container {
    display: flex;
    align-content: center;
    height: 100%;
    overflow-y: auto;

    .layer-menu {
      width: 80px;
      height: 100%;
      padding-top: 20px;
      background: @dark-primary-color;
      flex-shrink: 0;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 80px;
        background: @dark-primary-color;
        cursor: pointer;
        img {
          width: 50px;
          height: 50px;
        }
      }

      .menu-item-wrap {
        position: relative;

        .menu-item {
          height: 50px;
          width: 100%;
          color: @text-primary-color;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          z-index: 2;

          &.active {
            background: #fff;
          }

          .menu-item-icon {
            box-shadow: 0 0 10px @light-primary-color, 0 0 5px @default-primary-color;
          }
        }

        .mask {
          width: 70px!important;
          position: absolute;
          z-index: 1;
          right: 0;
          top: 0;
          //background: @background-color-base;
          background: @text-primary-color;
          border-top-left-radius: 30px;
          border-bottom-left-radius: 30px;
        }
      }
    }

    .layer-router-container {
      position: absolute;
      z-index: 99;
      width: 100%;
      height: 100%;
      padding: 40px 20px 20px;
      background: transparent;
      //background: @background-color-base;
    }
  }
}
</style>
