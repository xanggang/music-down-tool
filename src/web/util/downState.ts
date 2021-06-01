
export const menuList = [
  {
    name: '下载中',
    icon: 'icon-kuaijin-',
    state: 'downing'
  },
  {
    name: '等待中',
    icon: 'icon-zanting-1',
    state: 'padding'
  },
  {
    name: '已停止',
    icon: 'icon-dianshiju-',
    state: 'complete'
  }
]

export function filterDownState (state: 'waitdown' | 'progressing' | 'completed') {
  const map = {
    waitdown: '等待下载',
    progressing: '下载中',
    completed: '下载完成'
  }
  return map[state] as string
}
