import { expect } from 'chai'
import { getDirFiles } from '../../src/electorn/fileUtil/index'
import testDown from '../../src/electorn/testDown'

describe('test module: /src/electorn/fileUtil/index', () => {
  const filePtah = '/Users/lynn/Documents/www/lynn/electron-vue/src/assets'
  it('test: getDirFiles', async () => {
    const res = await getDirFiles('.mp3', filePtah)
    console.log(res)
  })

  it('test: down', async function () {
    this.timeout(10000)
    const res = await testDown()
    console.log(res)
  })
})
