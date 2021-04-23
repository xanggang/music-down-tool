import { protocol } from 'electron'

/**
 * @description 创建一个协议， 用来代替file协议读取本地文件
 * @param scheme
 */
export default function createAsarProtocol (scheme = 'local') {
  function handleFile (request: { url: string }, respond: (arg0: { path: string }) => void) {
    const url = request.url.substr(7)
    respond({ path: decodeURI(url) })
  }

  protocol.registerFileProtocol(scheme, handleFile)
}
