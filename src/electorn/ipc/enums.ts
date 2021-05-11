
// 系统配置相关
const ConfigApi = {
  // 修改系统配置， 这个是渲染进程主动获取的
  V_CHANG_SYS_SETTING: 'view:chang_sys_setting',
  // 改变系统配置，这个是由主进程推送的
  M_CHANG_SYS_SETTING: 'main:chang_sys_setting'
}

// 文件下载相关
const DownFileApi = {
// 下载一个文件
  V_DOWN_FILE: 'view:down_file',
  // 批量下载
  V_BATCH_DOWN_FILE: 'view:batch_down_file',
  // 暂停下载
  V_PAUSE_DOWN: 'view:pause_down',

  // 继续下载
  V_RESUME_DOWN: 'view:resume_down',

  // 删除任务
  V_DELETE_DOWN: 'view:delete_down',

  // 取消任务
  V_CANCEL_DOWN: 'view:cancel_down',

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

export default {
  ConfigApi,
  DownFileApi,
  ToolApi
}
