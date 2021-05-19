<template>
  <div class="search-main">
    <div class="search-header">
      <a-input v-model:value="keyword" @pressEnter="onSearch"></a-input>
      <a-button @click="onSearch" class="search-button">搜索</a-button>
    </div>
    <div class="search-container">
      <SongList v-if="songList.length">
        <SongItem
          v-for="(item, index) in songList"
          :key="index"
          :song="item"
          @down-song="handleDownSong"
        ></SongItem>

        <a-pagination
          v-model:current="current"
          :page-size="50"
          show-less-items
          :total="total"
          @change="searchSong"
        />
      </SongList>
      <Plate v-show="!songList.length"></Plate>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import SongList from './components/SongList.vue'
import SongItem from './components/SongItem.vue'
import Plate from '@/web/components/plate/index.vue'
import * as Api from '@/web/api'

import type { ISongListInfoTypes } from '@/types/playListTypes'

export default defineComponent({
  name: 'SearchMain',
  components: { SongList, SongItem, Plate },
  setup () {
    const state = reactive<any>({
      keyword: '',
      loading: false,
      songList: [],
      current: 0,
      total: 1
    })

    const searchSong = async () => {
      state.songList = []
      if (!state.keyword) return
      state.loading = true
      const res = await Api.searchSongByName(state.keyword, state.current)
      if (res) {
        state.songList = res.list
        state.total = res.total
      }
      state.loading = false
    }

    const onSearch = async () => {
      await searchSong()
    }

    const handleDownSong = async (song: ISongListInfoTypes) => {
      const res = await Api.getSongDetail1({
        id: song.id,
        vendor: song.vendor
      })

      const url = await Api.getSongPlayerUrl({
        id: song.id,
        vendor: song.vendor
      })

      console.log(res)
      console.log({ url })
    }

    return {
      ...toRefs(state),
      onSearch,
      searchSong,
      handleDownSong
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
    overflow: hidden;
  }
}
</style>
