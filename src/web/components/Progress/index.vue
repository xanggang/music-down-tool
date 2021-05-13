<template>
  <div class="progress-main" ref="root" @click="change">
    <div class="heart" ref="dom">
      <div class="wave"></div>
    </div>
    <!--    <div class="crop">-->
    <!--      <div class="wave"></div>-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'ProgressMain',
  setup () {
    const dom = ref<any>(null)
    const root = ref<any>(null)
    let width = 50

    const change = () => {
      console.log('change')
      if (!root.value) return
      root.value.style.setProperty('--base-width', `${width++}px`)
    }

    onMounted(() => {
      if (!root.value) return
      const width = root.value.offsetWidth * (4 / 7)
      const height = root.value.offsetHeight * (4 / 7)
      root.value.style.setProperty('--base-width', `${width}px`)
      root.value.style.setProperty('--base-height', `${height}px`)
    })

    return {
      dom,
      root,
      change
    }
  }
})
</script>

<style scoped lang="less">

.progress-main {
  --base-width: 100px;
  --base-height: 100px;

  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;

  .heart{
    position: relative;
    width: var(--base-width);
    height: var(--base-height);
    flex-shrink: 0;
    transform: rotate(45deg);
    background-color: #666666;
  }
  .heart::before{
    position: absolute;
    content: '';
    background-color: #666666;
    display: block;
    width: var(--base-width);
    height: var(--base-height);
    border-radius: 50%;//变圆
    top: calc(-1 * var(--base-width) / 2);
  }
  .heart::after{
    position: absolute;
    content: '';
    background-color: #666666;
    display: block;
    width: var(--base-width);
    height: var(--base-height);
    border-radius: 50%;
    left: calc(-1 * var(--base-width) / 2);
  }

  .crop {
    width: 50px;
    height: 50px;
    overflow: hidden;
    //transform: rotate(-45deg);
    border: 1px solid #000;
    background: pink;
  }
  .wave {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    background: pink;
    position: relative;
    margin-top: -35px;
    margin-right: -5px;

    &:before, &:after {
      content: "";
      position: absolute;
      left: 50%;
      min-width: 80px;
      min-height: 80px;
      background-color: #fff;
      animation-name: rotate;
      animation-iteration-count: infinite;
      animation-duration: 10s;
      animation-timing-function: cubic-bezier(0.39, 0.575, 0.565, 1);
    }

    &:before {
      transform: rotate(25deg);
      border-radius: 40%;
    }

    &:after {
      opacity: .5;
      animation-delay: 0.5s;
      border-radius: 45%;
    }
  }
}

@keyframes rotate {
  0% {
    transform: translate(-50%, 0) rotateZ(0deg);
  }
  50% {
    transform: translate(-50%, -2%) rotateZ(180deg);
  }
  100% {
    transform: translate(-50%, 0%) rotateZ(360deg);
  }
}
</style>
