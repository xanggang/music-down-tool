import Koa from 'koa'
import proxy from 'koa2-proxy-middleware'

const app = new Koa()

const options = {
  targets: {
    '/api': {
      // this is option of http-proxy-middleware
      target: 'https://freetyst.nf.migu.cn', // target host
      changeOrigin: true, // needed for virtual hosted sites
      pathRewrite: {
        '/api': '' // rewrite path
      }
    }
  }
}

app.use(proxy(options))

app.use(async ctx => {
  ctx.body = 'Hello World'
})

export default function () {
  console.log('app.listen in ' + 3000)
  app.listen(3000)
}

// https://freetyst.nf.migu.cn/public%2Fproduct5th%2Fproduct34%2F2019%2F07%2F1822%2F2009%E5%B9%B406%E6%9C%8826%E6%97%A5%E5%8D%9A%E5%B0%94%E6%99%AE%E6%96%AF%2F%E5%85%A8%E6%9B%B2%E8%AF%95%E5%90%AC%2FMp3_64_22_16%2F60054701923.mp3
//
// api
