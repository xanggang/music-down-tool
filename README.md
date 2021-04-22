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
