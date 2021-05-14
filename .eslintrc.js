module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  plugins: [
    'vue'
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-extra-semi': 2, // 禁止额外的分号
    'no-trailing-spaces': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'vue/script-indent': ['error', 2, { // script缩进配置
      baseIndent: 0,
      ignores: ['SwitchCase']
    }],
    'vue/html-closing-bracket-newline': ['error', { // html右括号的位置，多行标签换行
      singleline: 'never',
      multiline: 'always'
    }],
    'vue/html-indent': ['error', 2, {
      attribute: 1 // 属性的缩进倍数
    }],
    'vue/html-quotes': ['error', 'double'], // HTML属性的双引号样式
    'vue/max-attributes-per-line': ['error', {
      singleline: 3, // 单行超过3个属性，则换行
      multiline: {
        max: 1 // 多行最多只允许1个属性
      }
    }],
    'vue/multiline-html-element-content-newline': ['error', { // 多行元素的内容之前和之后执行换行
      ignoreWhenEmpty: true,
      allowEmptyLines: false
    }],
    'vue/mustache-interpolation-spacing': ['error', 'always'], // 插值统一间距
    'vue/order-in-components': ['error', {
      order: [
        'el',
        'name',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'fetch',
        'asyncData',
        'data',
        'computed',
        'watch',
        'LIFECYCLE_HOOKS',
        'methods',
        'head',
        ['template', 'render'],
        'renderError'
      ]
    }],
    'vue/space-infix-ops': ['error', { int32Hint: false }], // 缀操作符之间的间距
    'vue/no-v-model-argument': 0
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
