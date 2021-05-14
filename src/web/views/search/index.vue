<template>
  <div class="search-main">
    <div class="search-header">
      <a-input v-model:value="keyword" @pressEnter="handleClick"></a-input>
      <a-button @click="handleClick" class="search-button">搜索</a-button>
    </div>
    <!--    <a-spin :spinning="loading">-->
    <div class="search-container">
      <SongList>
        <SongItem v-for="(item, index) in songList" :key="index" :song="item"></SongItem>
      </SongList>
    </div>
    <!--    </a-spin>-->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import SongList from './components/SongList.vue'
import SongItem from './components/SongItem.vue'
import * as Api from '@/web/api'
import to from 'await-to-js'

export default defineComponent({
  name: 'SearchMain',
  components: { SongList, SongItem },
  setup () {
    const state = reactive({
      keyword: '',
      loading: false,
      songList: []
    })

    const handleClick = async () => {
      state.loading = true
      const [res] = await to(Api.searchSongByName(state.keyword))
      if (res) {
        console.log(res)
        state.songList = res as any
      }
      state.loading = false
    }

    return {
      ...toRefs(state),
      handleClick
    }
  }
})
</script>

<style scoped lang="less">

.search-main {
  height: 100%;
  width: 100%;

  .search-header {
    display: flex;
    align-items: center;
    height: 50px;
    width: 100%;

    .search-button {
      margin-left: 20px;
    }
  }

  .search-container {
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
  }
}
</style>
