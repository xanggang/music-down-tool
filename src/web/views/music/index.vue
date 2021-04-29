<template>
  <div style="padding: 20px">
<!--    <a-input v-model:value="songName"></a-input>-->
<!--    <a-button type="primary" @click="searchMusicByName">Primary</a-button>-->
<!--    <div-->
<!--      v-for="(item, index) in songList"-->
<!--      :key="index"-->
<!--      @click="handlePlay(item)"-->
<!--    >-->
<!--      {{item.name }}-->
<!--    </div>-->
<!--    <audio controls>-->
<!--      <audio class="play" autoplay src="music.mp3" type="audio/mpeg"></audio>-->
<!--    </audio>-->

<!--    <a-button @click="handlePlay">当时的</a-button>-->

    {{ state }}
    <a-button @click="change">assd</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { Howl } from 'howler'
export default defineComponent({
  name: 'music-root',
  setup () {
    const state = reactive<any>({
      a: {
        b: 1
      }
    })
    const change = () => {
      state.a.c = 1
    }
    return {
      state,
      change
    }
  },
  methods: {
    handlePlay () {
      const sound = new Howl({
        src: './music.mp3'
      })

      sound.play()
    }
  }
})
</script>

<style scoped>

.play {
  width: 200px;
  height: 20px;
  background: pink;
}
</style>
