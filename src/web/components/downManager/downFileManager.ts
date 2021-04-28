import { ref, reactive, computed } from 'vue'
import { useStore } from '@/web/store'

export function useDownFileManager () {
  const store = useStore()
  const waitDownloadList = computed(() => store.state.down.waitDownloadList)
  const downList = computed(() => store.state.down.downList)
  const downedList = computed(() => store.state.down.downedList)
}
