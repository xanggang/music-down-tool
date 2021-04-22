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
    <audio controls>
      <audio class="play" autoplay src="music.mp3" type="audio/mpeg"></audio>
    </audio>

    <a-button @click="handlePlay">当时的</a-button>

<!--    <audio class="play"  controls type="audio/mpeg" src="/api/public%2Fproduct5th%2Fproduct34%2F2019%2F07%2F1822%2F2009%E5%B9%B406%E6%9C%8826%E6%97%A5%E5%8D%9A%E5%B0%94%E6%99%AE%E6%96%AF%2F%E5%85%A8%E6%9B%B2%E8%AF%95%E5%90%AC%2FMp3_64_22_16%2F60054701923.mp3"></audio>-->
<!--    <audio class="play" autoplay controls src="./梁咏琪-短发.mp3" type="audio/mpeg"></audio>-->
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
// import useMusic from '../../api'
import { Howl } from 'howler'
const url = '/public%2Fproduct5th%2Fproduct34%2F2019%2F07%2F1822%2F2009%E5%B9%B406%E6%9C%8826%E6%97%A5%E5%8D%9A%E5%B0%94%E6%99%AE%E6%96%AF%2F%E5%85%A8%E6%9B%B2%E8%AF%95%E5%90%AC%2FMp3_64_22_16%2F60054701923.mp3'
export default defineComponent({
  name: 'music-root',
  setup () {
    // const { data, searchMusicByName } = useMusic()
    // const { songName, totalResult, songList } = toRefs(data)
    // return {
    //   songName,
    //   totalResult,
    //   songList,
    //   searchMusicByName
    // }
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
