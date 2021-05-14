import BaseController from '@/electorn/controller/base'
import { IpcMainEvent } from 'electron'
import { Ipc } from '@/electorn/router/decorator'
import Api from '@/electorn/enums/ApiEnums'
import musicApi, { vendor } from '@suen/music-api'

interface ISearchParams {
  vendor: vendor;
  id: number | string;
}

export default class SongSearchController extends BaseController {
  /**
   * 通过关键词查询列表
   */
  @Ipc(Api.SearchSongApi.V_SEARCH_SONG_BY_NAME_START)
  async getMusicListByName (event: IpcMainEvent, keyword: string) {
    try {
      const res = await musicApi.searchSong(keyword)
      event.sender.send(Api.SearchSongApi.V_SEARCH_SONG_BY_NAME_END, res)
    } catch (err) {
      console.error(err)
      event.sender.send(Api.SearchSongApi.V_SEARCH_SONG_BY_NAME_END, [])
    }
  }

  /**
   * 查询歌曲详情
   */
  @Ipc(Api.SearchSongApi.V_GET_SONG_DETAIL_STATE)
  async getSongDetail (event: IpcMainEvent, { vendor, id }: ISearchParams) {
    try {
      const res = await musicApi.getSongDetail(vendor, id)
      event.sender.send(Api.SearchSongApi.V_GET_SONG_DETAIL_END, res)
    } catch (err) {
      console.error(err)
      event.sender.send(Api.SearchSongApi.V_GET_SONG_DETAIL_END, {})
    }
  }

  /**
   * 查询歌曲歌词
   */
  @Ipc(Api.SearchSongApi.V_GET_LYRIC_START)
  async getSongLyric (event: IpcMainEvent, { vendor, id }: ISearchParams) {
    try {
      const res = await musicApi.getLyric(vendor, id)
      event.sender.send(Api.SearchSongApi.V_GET_LYRIC_END, res)
    } catch (err) {
      console.error(err)
      event.sender.send(Api.SearchSongApi.V_GET_LYRIC_END, {})
    }
  }

  /**
   * 查询歌曲播放地址
   */
  @Ipc(Api.SearchSongApi.V_GET_PLAYER_URL_START)
  async getSongPlayerUrl (event: IpcMainEvent, { vendor, id }: ISearchParams) {
    try {
      const res = await musicApi.getSongUrl(vendor, id)
      event.sender.send(Api.SearchSongApi.V_GET_PLAYER_URL_END, res)
    } catch (err) {
      console.error(err)
      event.sender.send(Api.SearchSongApi.V_GET_PLAYER_URL_END, {})
    }
  }
}
