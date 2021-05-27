import { useStore } from '@/web/store'

export default function () {
  const store = useStore()

  // 暂停全部下载
  const handlePauseAll = () => {
    store.dispatch('down/handlePauseAll')
  }
}
