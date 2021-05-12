import { ref, reactive, onMounted } from 'vue'
import { useStore } from '@/web/store'

const waitDownloadList = [] // 等待下载队列
const downingLoadList = [] // 正在下载队列
const downloadList = {} // 队列信息

export function useDownFileManager () {
  const state = reactive({
    queueList: [], // 下载队列
    waitDownloadList: [],
    downingLoadList: [],
    downloadList: [],
    downPath: '' // 下载的文件夹
  })
}
