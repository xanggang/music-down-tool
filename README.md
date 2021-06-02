### 暂时移除样式i校验和commit校验
```json5
  "config": {
    "commitizen": {
      "path": "./node_modules/vue-cli-plugin-commitlint/lib/cz"
    }
  },
  "husky": {
    "hooks": {
      "pre-commit": "yarn lint",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
```

### todo
- 记录历史下载队列信息
- 全部暂停
- 全部开始
- 打开文件夹前先检察文件是否存在
- 相同文件名下载
- loading效果

### 下载操作
1， 开始一个任务
2， 暂停一个任务
3， 删除一个任务
4， 取消一个项目
5， 打开完成的文件夹
6， 复制下载链接

7， 暂停全部任务
8， 取消全部任务
9， 恢复全部任务
10， 清除下载记录
