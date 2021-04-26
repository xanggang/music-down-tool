const puppeteer = require('puppeteer-core')
const fs = require('fs')
const findChrome = require('../node_modules/carlo/lib/find_chrome')
const _ = require('lodash')
const urlMap = require('./emu')
const fileUtil = require('./wireFile')

// 入口
async function run () {
  const findChromePath = await findChrome({})
  const executablePath = findChromePath.executablePath
  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
    devtools: true,
    userDataDir: 'test-profile-dir'
  })
  const page = await browser.newPage()
  await page.goto('https://music.migu.cn/v3/music/player/audio?from=migu')

  await addEventListener(page)
}

async function addEventListener (page) {
  let musicInfo = []
  let lastSong = {}
  let largePic = 'empty'
  let smallPic = 'empty'
  let lyric = 'empty'
  let playUrl = 'empty'
  let curentIndex = 0

  const handleSuccess = () => {
    const list = [largePic, smallPic, lyric, playUrl]
    if (list.some(d => d === 'empty')) return
    lastSong.largePic = largePic
    lastSong.smallPic = smallPic
    lastSong.lyric = lyric
    lastSong.playUrl = playUrl
    fs.appendFileSync('./downMisic/data/data.json', JSON.stringify(lastSong))
    largePic = 'empty'
    smallPic = 'empty'
    lyric = 'empty'
    playUrl = 'empty'
    curentIndex++
    if (curentIndex !== musicInfo.length - 1) {
      next(page)
    }
  }

  page.on('response', async res => {
    const url = res.url()
    const urlParams = new URL(url)

    // 获取歌单信息， 一般来说这个会先触发
    if (url.startsWith(urlMap.playerUrl)) {
      const data = await res.json()
      musicInfo = await getMusicListInfo(data)
      fs.writeFileSync('./downMisic/data/playerList.json', JSON.stringify(musicInfo))
    }

    //
    if (url.startsWith(urlMap.congPicUrl)) {
      const data = await res.json()

      const songId = urlParams.searchParams.get('songId')
      const target = musicInfo.find(item => item.songId == songId)
      if (!target) {
        console.error(`歌曲${songId}不在播放列表`)
      }
      lastSong = target
      largePic = data.largePic
      smallPic = data.smallPic
      handleSuccess()
    }

    if (url.startsWith(urlMap.getLyricUrl)) {
      const data = await res.json()
      const copyrightId = urlParams.searchParams.get('copyrightId')
      const target = musicInfo.find(item => item.copyrightId == copyrightId)
      if (!target) {
        console.error(`歌曲${copyrightId}不在播放列表， 设置歌词信息失败`)
      }
      lastSong = target
      lyric = data.lyric
      handleSuccess()
    }

    if (url.startsWith(urlMap.playInfoUrl)) {
      const data = await res.json()
      // url中的数据被加密了， 解密太麻烦了， 直接利用之前的信息
      playUrl = data.data.playUrl
      handleSuccess()
    }
  })
}

async function getMusicListInfo (data) {
  const items = data.items
  const infoList = items.map(item => {
    return {
      songId: item.songId,
      songName: item.songName,
      artistName: _.get(item, 'singers.songName'), // 歌手
      artistId: _.get(item, 'singers.artistId'), // 歌手id
      albumsId: _.get(item, 'albums.albumId'), // 歌手id
      albumName: _.get(item, 'albums.albumName'), // 歌手id
      copyrightId: item.copyrightId,
      length: item.length,
      downPath: fileUtil.getBasePath(item.songName)
    }
  })
  console.log('获取歌单信息, 长度', infoList.length)
  return infoList
}

async function next (page) {
  console.log('准备点击下一首')
  setTimeout(() => {
    page.click('.next').catch(e => {
      console.log('点击下一首失败')
      console.error(e)
    })
  }, 500)
}

run()
