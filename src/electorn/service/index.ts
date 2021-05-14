// import Koa from 'koa'
// import proxy from 'koa2-proxy-middleware'
// import musicApi from '@suen/music-api'
//
// const app = new Koa()
//
// const options = {
//   targets: {
//     '/api': {
//       // this is option of http-proxy-middleware
//       target: 'https://freetyst.nf.migu.cn', // target host
//       changeOrigin: true, // needed for virtual hosted sites
//       pathRewrite: {
//         '/api': '' // rewrite path
//       }
//     }
//   }
// }
//
// app.use(proxy(options))
//
// app.use(async ctx => {
//   ctx.body = 'Hello World'
// })
//
// export default function () {
//   console.log('app.listen in ' + 3000)
//   app.listen(3000)
// }
//
// import musicApi from '@suen/music-api'
//
// export default function () {
//   console.log('app.listen in ' + 3000)
//   try {
//     musicApi.searchSong('周杰伦')
//       .then(data => {
//         // console.log({ data })
//       })
//   } catch (e) {
//     console.log(123)
//     console.error({ e })
//   }
// }
