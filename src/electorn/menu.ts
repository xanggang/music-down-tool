
import { Menu } from 'electron'

const template = [
  { label: '首页' },
  {
    label: '新闻资讯',
    submenu: [
      {
        label: '国内新闻',
        submenu: [
          {
            label: '北京新闻'
          },
          {
            label: '河南新闻'
          }
        ]
      },
      {
        label: '国际新闻'
      }
    ]
  },
  {
    label: '娱乐',
    submenu: [
      {
        label: '音乐'
      },
      {
        label: '电影'
      },
      {
        label: '综艺'
      }
    ]
  },
  {
    label: '科技',
    submenu: [
      {
        label: 'Al'
      },
      {
        label: '手机'
      },
      {
        label: '互联网'
      }
    ]
  }
]

export default function () {
  const list = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(list)
}
