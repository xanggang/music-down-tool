import type { vendor } from '@suen/music-api'

export function useVendorToCn (vendorString: keyof typeof vendor) {
  const map = {
    netease: '网易云',
    qq: 'QQ音乐',
    xiami: '虾米音乐'
  }
  return map[vendorString] || '未知'
}
