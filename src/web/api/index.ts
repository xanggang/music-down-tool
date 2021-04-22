import { ref, reactive, toRefs } from 'vue'
const ipcRenderer = window.require('electron').ipcRenderer

export default function getMusicByName () {
  const data = reactive({
    songName: '',
    totalResult: 0,
    songList: []
  })

  const saveSearchRes = function (event: any, arg: any) {
    data.songList = arg.list
    data.totalResult = arg.total
  }

  const searchMusicByName = async function () {
    ipcRenderer.once('song-res', saveSearchRes)
    ipcRenderer.send('ipc-node-search-song', data.songName)
  }

  return {
    data,
    searchMusicByName
  }
}
