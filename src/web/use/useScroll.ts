import { ref, onMounted, onUpdated, onUnmounted, Ref } from 'vue'

function getClientHeight (dom: HTMLElement) {
  return dom.clientHeight
}

function getContentHeight (dom: HTMLElement) {
  const children = Array.from(dom.children) || []
  if (children.length === 1) {
    return children[0].clientHeight
  } else {
    return children.reduce((tol, cur) => {
      return tol + cur.clientHeight
    }, 0)
  }
}

interface IUseScroll {
  scrollContainer: Ref<HTMLElement | null>;
  hasScroll: Ref<boolean>;
  scrollTop: () => void;
}

export default function useScroll (): IUseScroll {
  // 滚动容器
  const scrollContainer = ref<HTMLElement | null>(null)
  const hasScroll = ref(false)
  // 容器的高度
  let containerHeight = 0
  let childHeight = 0

  const getRes = () => {
    if (!scrollContainer.value) return
    containerHeight = getClientHeight(scrollContainer.value)
    childHeight = getContentHeight(scrollContainer.value)
    hasScroll.value = containerHeight < childHeight
  }

  onMounted(() => {
    getRes()
  })

  onUpdated(() => {
    getRes()
  })

  onUnmounted(() => {
    scrollContainer.value = null
  })

  const scrollTop = () => {
    if (!scrollContainer.value) return
    scrollContainer.value.scrollTop = 0
  }

  return {
    scrollContainer,
    hasScroll,
    scrollTop
  }
}
