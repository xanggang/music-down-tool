import { ref } from 'vue'

export default function useHover () {
  const hover = ref(false)
  const bindMouseEvent = {
    mouseLeave: () => {
      hover.value = false
    },
    mouseEnter: () => {
      hover.value = true
    }
  }
  return {
    hover,
    bindMouseEvent
  }
}
