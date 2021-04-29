// import fs from 'fs'
// import path from 'path'
// import request from 'request'
// // import { dialog } from 'electron'
//
// const basePath = path.resolve(process.cwd())
// const sourcefolder = path.join(basePath, '/file/')
// const name = 'AS1875dd224f9487154de50fdd20137052.jpg'
// function downloadFile (item: any, callback: any) {
//   const downPath = path.join(`${sourcefolder}/${name}`)
//   console.log(downPath)
//   // const uri = 'https://freetyst.nf.migu.cn/public/product9th/product42/2021/01/2612/2009年06月26日博尔普斯/歌曲下载/MP3_40_16_Stero/60054701938124543.mp3?key=49979f81e373c100&Tim=1619349468395&channelid=00&msisdn=e5582e73d8eb4ee2a1cee25e508c6ebb&CI=600547019382600902000006889306&F=000009'
//   const uri = 'https://cdnmusic.migu.cn/picture/2020/0918/1728/AS1875dd224f9487154de50fdd20137052.jpg'
//   const stream = fs.createWriteStream(downPath)
//   request(encodeURI(uri))
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
//   return new Promise((resolve) => {
//     downloadFile({}, (e: any) => {
//       resolve('成功')
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
