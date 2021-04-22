// import fs from 'fs'
// import path from 'path'
// import request from 'request'
// import { dialog } from 'electron'
//
// const config = {
//   type: 'qq',
//   link: 'http://y.qq.com/n/yqq/song/003OUlho2HcRHC.html',
//   songid: '003OUlho2HcRHC',
//   title: '告白气球',
//   author: '周杰伦',
//   url: 'http://dl.stream.qqmusic.qq.com/M500003OUlho2HcRHC.mp3?vkey=309E6D9A983B85DB2CF16DF19E63DB00F721F91AD105B59371058F565DBE63B16C670219141DFD6CE6FF9AB0636E6E947A511C0A9F26EF28&guid=5150825362&fromtag=1',
//   pic: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003RMaRI1iFoYd.jpg',
//   path: '31/003OUlho2HcRHC.mp3'
// }
//
// const musciPath = 'http://music.163.com/song/media/outer/url?id=22677570.mp3'
//
// const basePath = path.resolve(process.cwd())
// const sourcefolder = path.join(basePath, '/file/')
//
// function downloadFile (item: any, callback: any) {
//   const uri = musciPath
//   const name = `${item.songid}.${uri.split('?')[0].split('com/')[1].split('.')[1]}`
//   const downPath = path.join(`${sourcefolder}/${name}`)
//   console.log(downPath)
//   // if (!fs.existsSync(downPath)) {
//   //   fs.mkdirSync(downPath)
//   // }
//   const stream = fs.createWriteStream(downPath)
//   request(uri)
//     .pipe(stream)
//     .on('close', (e: any) => {
//       stream.close()
//       callback && callback(e)
//     })
//     .on('error', (e: any) => {
//       callback && callback(e)
//     })
// }
//
// export default async function () {
//   console.log(1)
//   return new Promise((resolve) => {
//     downloadFile(config, (e: any) => {
//       console.log(2)
//       console.log(e)
//       resolve()
//     })
//   })
// }
//
// // function downloadFile (item: any, callback: any) {
// //   const uri = item.url
// //   const name = `${item.songid}.${uri.split('?')[0].split('com/')[1].split('.')[1]}`
// //   const downPath = path.join(`${sourcefolder}/${name}`)
// //   console.log(downPath)
// //   // if (!fs.existsSync(downPath)) {
// //   //   fs.mkdirSync(downPath)
// //   // }
// //   const stream = fs.createWriteStream(downPath)
// //
// //   axios.get(uri, { responseType: 'stream' }).then(success => {
// //     success.data.pipe(stream)
// //     success.data.on('close', () => {
// //       console.log('写入成功')
// //       stream.close()
// //       callback()
// //     })
// //   })
// // }
//
// // /*
// // * https://zhaoqize.github.io/puppeteer-api-zh_CN/#/
// // * */
// // const puppeteer = require('puppeteer-core')
// // const fs = require('fs')
// //
// // let jsonDataList = [];
// // (async () => {
// //   const browser = await puppeteer.launch({
// //     executablePath: `C:/Program Files (x86)/Google/Chrome/Application/chrome`,
// //     headless: true
// //   })
// //   const page = await browser.newPage()
// //   await page.goto('http://music.wandhi.com/?name=%E5%91%A8%E6%9D%B0%E4%BC%A6&type=qq')
// //
// //   // 根据网站规则，监听页面ajax请求，截获请求数据
// //   page.on('response', async res => {
// //     const url = res.url()
// //     if (url === 'http://music.wandhi.com/') {
// //       const data = await res.json()
// //       const list = data.data
// //       jsonDataList.push(...list)
// //
// //       // 词曲分离分别写入各自文件
// //       function writeData() {
// //         let list = jsonDataList.map(item => {
// //           const lrcJson = JSON.stringify({lrc: item.lrc}, null, 4)
// //           fs.writeFile(`./musicLrc/${item.songid}.json`, lrcJson, (e, result) => {
// //             if (e) {
// //               console.error(e)
// //             }
// //           })
// //           // 剔除歌词
// //           delete item.lrc
// //           return item
// //         })
// //         // 写入歌曲列表
// //         fs.writeFile('musicList.json', JSON.stringify(list, null, 4), (e, result) => {
// //           if (e) {
// //             console.error(e)
// //           }
// //         })
// //       }
// //
// //       // 判断列表长度自动翻页
// //       if (list.length >= 10) {
// //         console.log('下一页')
// //         // 此处需要延迟执行 300s 最为合适
// //         setTimeout(() => {
// //           page.click('.aplayer-more').catch(e => {
// //             writeData()
// //           })
// //         }, 300)
// //       } else {
// //         writeData()
// //       }
// //     }
// //   })
// // })()
