import APi from '@/electorn/enums/ApiEnums'
import _ from 'lodash'
import type { vendor, searchSongResult, musicInfo } from '@suen/music-api'
import type { ISongListInfoTypes } from '@/types/playListTypes'
const { ipcRenderer } = window.require('electron')

type IMusicApiSearchSongResult = Record<vendor, searchSongResult>

/**
 * 搜索歌曲
 * @param keyword
 */
export async function searchSongByName (keyword: string): Promise<ISongListInfoTypes[]> {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(APi.SearchSongApi.V_SEARCH_SONG_BY_NAME_START, keyword)
    ipcRenderer.once(APi.SearchSongApi.V_SEARCH_SONG_BY_NAME_END, function (event: any, arg: any) {
      if (!arg.status) return reject(new Error('搜索歌曲信息失败'))
      const data = arg.data as IMusicApiSearchSongResult
      const arr: ISongListInfoTypes[] = []
      Object.values(data).forEach(item => {
        if (!item.songs) return
        item.songs.forEach((_song: musicInfo) => {
          arr.push({
            name: _song.name,
            artist: _.get(_song, 'artists[0].name') || '未知',
            album: _.get(_song, 'album.name') || '未知',
            albumImage: _.get(_song, 'album.cover') || '未知',
            vendor: _.get(_song, 'vendor') as vendor
          })
        })
      })
      resolve(arr)
    })
  })
}
