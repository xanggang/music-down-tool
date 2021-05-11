import jsmediatags from 'jsmediatags'
import mp3Duration from 'mp3-duration'
import fs from 'fs-extra'
import path from 'path'
import _ from 'lodash'

import type { IMp3InfoTypes } from '@/types/playListTypes'

/**
 * 获取mp3文件的tag信息
 * @param path
 */
interface IMp3TagInfo {
  musicName: string;
  artist: string;
  album: string;
  size: number;
}
function getMusicTag (filePath: string): Promise<IMp3TagInfo> {
  return new Promise((resolve, reject) => {
    jsmediatags.read(filePath, {
      onSuccess: function (tag: any) {
        const info: any = {}
        // const picture = tag.tags.picture.data
        console.log({ tag })
        info.musicName = _.get(tag, 'tags.title', '未知')
        info.artist = _.get(tag, 'tags.artist', '未知')
        info.album = _.get(tag, 'tags.album', '未知')
        resolve(info)
      },
      onError: function (error: Error) {
        reject(error)
      }
    })
  })
}

/**
 * 获取mp3的长度
 * @param filePath
 */
function getMp3Duration (filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    mp3Duration(filePath, function (err: Error, duration: number) {
      if (err) return reject(err)
      resolve(duration)
    })
  })
}

export default class MusicUtil {
  static async getMp3Info (filePath: string): Promise<IMp3InfoTypes> {
    if (!fs.existsSync(filePath)) {
      throw new Error('文件不存在， path:' + filePath)
    }
    try {
      // console.time('读取文件信息耗时')
      const tagInfo = await getMusicTag(filePath)
      const duration = await getMp3Duration(filePath)
      const extname = path.extname(filePath)
      // console.timeEnd('读取文件信息耗时')
      return {
        path: filePath,
        length: duration,
        extname,
        musicName: tagInfo.musicName,
        album: tagInfo.album,
        artist: tagInfo.artist
      }
    } catch (err) {
      // console.error('获取歌曲信息错误', err)
      throw new Error(err.message)
    }
  }
}
