import { expect } from 'chai'
import { getDirFiles } from '../../src/electorn/fileUtil/index'

describe('test module: /src/electorn/fileUtil/index', () => {
  const filePtah = '/Users/lynn/Documents/www/lynn/electron-vue/src/assets'
  it('test: getDirFiles', async () => {
    const res = await getDirFiles('.mp3', filePtah)
    console.log(res)
  })
})
