
const ConfigApi = {
  // 修改系统配置， 这个是渲染进程主动获取的
  V_CHANG_SYS_SETTING_START: 'view:chang_sys_setting_start',
  V_CHANG_SYS_SETTING_END: 'view:chang_sys_setting_end',
  // 改变系统配置，这个是由主进程推送的
  M_CHANG_SYS_SETTING: 'main:chang_sys_setting'
}

// 文件下载相关
const DownFileApi = {
// 下载一个文件
  V_DOWN_FILE: 'view:down_file',
  // 批量下载
  V_BATCH_DOWN_FILE: 'view:batch_down_file',

  // 继续下载
  V_RESUME_DOWN: 'view:resume_down',

  // 暂停下载
  V_PAUSE_DOWN: 'view:pause_down',

  // 取消任务
  V_CANCEL_DOWN: 'view:cancel_down',

  V_DELETE_DOWN_HISTORY: 'view:delete_down_history',

  // 全部暂停
  V_PAUSE_ALL: 'view:pause_all',

  // 取消全部
  V_CANCEL_ALL: 'view:cancel_all',

  // 清空全部下载记录
  V_CLEAR_ALL_START: 'view:clear_all_start',
  V_CLEAR_ALL_END: 'view:clear_all_end',

  // 获取下载记录
  V_GET_DOWN_LIST_START: 'view:get_down_list_start',
  V_GET_DOWN_LIST_END: 'view:get_down_list_end',

  // 下载进度条事件
  M_DOWN_PROGRESS: 'main:down_progress_change',

  // 下载完成事件
  M_DOWN_SUCCESS: 'main:down_success'
}

// 工具类
const ToolApi = {
  // 获取文件夹下的全部文件
  V_GET_DIR_FILE_LIST: 'view:get_dir_file_list',
  // 打开选择文件夹的弹窗
  V_SAVE_PATH_DIALOG: 'view:save_path_dialog',
  // 获取文件图标
  V_GET_FILE_ICON: 'view:get_file_icon',
  // 打开指定文件夹
  V_OPEN_FOLDER: 'view:open_folder',
  // 打开一个文件
  V_OPEN_SINGLE_FILE: 'view:open_single_file'
}

const PlayListApi = {
  // 扫描一个文件夹， 获取其下面的全部音乐信息
  V_SCANNING_FOLDER_START: 'view:scanning_folder_start',
  V_SCANNING_FOLDER_END: 'view:scanning_folder_start_end'
}

const SearchSongApi = {
  // 通过歌曲名查询歌曲列表
  V_SEARCH_SONG_BY_NAME_START: 'view:search_song_by_name_start',
  V_SEARCH_SONG_BY_NAME_END: 'view:search_song_by_name_end',
  // 查询歌曲详情
  V_GET_SONG_DETAIL_STATE: 'view:get_song_detail_start',
  V_GET_SONG_DETAIL_END: 'view:get_song_detail_end',
  // 查询播放地址
  V_GET_PLAYER_URL_START: 'view:get_player_url_start',
  V_GET_PLAYER_URL_END: 'view:get_player_url_end',
  // 查询歌词
  V_GET_LYRIC_START: 'view:get_lyric_start',
  V_GET_LYRIC_END: 'view:get_lyric_end'
}

const APi = {
  ConfigApi,
  DownFileApi,
  ToolApi,
  PlayListApi,
  SearchSongApi
}
export default APi
