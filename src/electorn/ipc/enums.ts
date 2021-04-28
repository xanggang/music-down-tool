/**
 * 浏览器发起的
 */
// 修改系统配置， 这个是渲染进程主动获取的
export const V_CHANG_SYS_SETTING = 'view:chang_sys_setting'

// 获取文件夹下的全部文件
export const V_GET_DIR_FILE_LIST = 'view:get_dir_file_list'

// 打开选择文件夹的弹窗
export const V_SAVE_PATH_DIALOG = 'view:save_path_dialog'

// 下载一个文件
export const V_DOWN_FILE = 'view:down_file'

// 批量下载
export const V_BATCH_DOWN_FILE = 'view:batch_down_file'

// 获取文件图标
export const V_GET_FILE_ICON = 'view:get_file_icon'

// 打开指定文件夹
export const V_OPEN_FOLDER = 'view:open_folder'

/**
 * 主进程发起的
 */
// 改变系统配置，这个是由主进程推送的
export const M_CHANG_SYS_SETTING = 'main:chang_sys_setting'

// 下载进度条事件
export const M_DOWN_PROGRESS = 'main:down_progress_change'

// 下载完成事件
export const M_DOWN_SUCCESS = 'main:down_success'
