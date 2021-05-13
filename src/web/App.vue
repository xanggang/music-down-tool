<template>
  <Layer></Layer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Layer from 'web/components/Layer/index.vue'

export default defineComponent({
  name: 'root',
  components: { Layer }
})

</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
</style>

<style>
.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
