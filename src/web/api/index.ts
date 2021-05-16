import APi from '@/electorn/enums/ApiEnums'
import _ from 'lodash'
import base from './base'
import type { vendor, musicInfo } from '@suen/music-api'
import type { ISongListInfoTypes, ISearchParams, ISearchSongResult, IMusicApiSearchSongResult } from '@/types/playListTypes'
const { ipcRenderer } = window.require('electron')

/**
 * 搜索歌曲
 * @param keyword
 * @param offset
 */
export async function searchSongByName (keyword: string, offset: number): Promise<ISearchSongResult> {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(APi.SearchSongApi.V_SEARCH_SONG_BY_NAME_START, { keyword, offset })
    ipcRenderer.once(APi.SearchSongApi.V_SEARCH_SONG_BY_NAME_END, function (event: any, arg: any) {
      if (!arg.status) return reject(new Error('搜索歌曲信息失败'))
      const data = arg.data as IMusicApiSearchSongResult
      const arr: ISongListInfoTypes[] = []
      let total = 0
      Object.values(data).forEach(item => {
        if (!item.songs) return
        total += (item.total || 0)
        item.songs.forEach((_song: musicInfo) => {
          arr.push({
            id: _song.id,
            name: _song.name,
            artist: _.get(_song, 'artists[0].name') || '未知',
            album: _.get(_song, 'album.name') || '未知',
            albumImage: _.get(_song, 'album.cover') || '未知',
            vendor: _.get(_song, 'vendor') as vendor
          })
        })
      })
      resolve({
        list: arr,
        total
      })
    })
  })
}

/**
 * 获取选中歌曲的歌曲信息
 * @param id
 * vendor
 */
export async function getSongDetail ({ id, vendor }: ISearchParams): Promise<ISongListInfoTypes[]> {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(APi.SearchSongApi.V_GET_SONG_DETAIL_STATE, { id, vendor })
    ipcRenderer.once(APi.SearchSongApi.V_GET_SONG_DETAIL_END, function (event: any, arg: any) {
      if (!arg.status) return reject(new Error('搜索歌曲信息失败'))
      resolve(arg)
    })
  })
}

/**
 * 获取选中歌曲的歌曲信息
 * @param id
 * vendor
 */
export async function getSongDetail1 ({ id, vendor }: ISearchParams): Promise<musicInfo> {
  return await base<musicInfo>(APi.SearchSongApi.V_GET_SONG_DETAIL_STATE,
    APi.SearchSongApi.V_GET_SONG_DETAIL_END,
    { id, vendor })
}

/**
 * 获取选中歌曲的播放地址
 * @param id
 * vendor
 */
export async function getSongPlayerUrl ({ id, vendor }: ISearchParams): Promise<string> {
  return await base<string>(APi.SearchSongApi.V_GET_PLAYER_URL_START,
    APi.SearchSongApi.V_GET_PLAYER_URL_END,
    { id, vendor })
}

/**
 * 获取选中歌曲的歌词地址
 * @param id
 * vendor
 */
export async function getSongLyric ({ id, vendor }: ISearchParams): Promise<string> {
  return await base<string>(APi.SearchSongApi.V_GET_LYRIC_START,
    APi.SearchSongApi.V_GET_LYRIC_END,
    { id, vendor })
}
