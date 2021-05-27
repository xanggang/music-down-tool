import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, { key } from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// import '@/web/assets/icon-font/iconfont'
// import '@/web/assets/icon-font/iconfont.css'
import '@/web/style/format.less'

const app = createApp(App)

app.use(store, key).use(router).use(Antd).mount('#app')
