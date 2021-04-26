
// 获取播放列表
// ?type=3&playListId=196637449&pageNum=1&pageSize=300
const playerUrl = 'https://music.migu.cn/v3/api/music/audioPlayer/songs'

// 获取歌曲图片
const congPicUrl = 'https://music.migu.cn/v3/api/music/audioPlayer/getSongPic'

// 歌词文件
const getLyricUrl = 'https://music.migu.cn/v3/api/music/audioPlayer/getLyric'

// 歌曲的信息
const playInfoUrl = 'https://music.migu.cn/v3/api/music/audioPlayer/getPlayInfo'

module.exports = {
  playerUrl,
  congPicUrl,
  getLyricUrl,
  playInfoUrl
}
