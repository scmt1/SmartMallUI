import Vue from 'vue'
import ElementUI from 'element-ui'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils'
import echarts from '@/utils/echarts'
import BaiduMap from 'vue-baidu-map'
import i18n from './i18n/i18n'
import moment from 'moment'
import { newMessage } from '@/utils/newMessage'
import '@/assets/scss/_variables.scss'
import 'element-ui/lib/theme-chalk/icon.css'
import DOMPurify from 'dompurify'

Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
Vue.use(VueCookie)
Vue.use(ElementUI)
Vue.config.productionTip = false
// ak 是在百度地图开发者平台申请的密钥
Vue.use(BaiduMap, { ak: 'xxx' })

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法
Vue.prototype.$echarts = echarts
Vue.prototype.$newMessage = newMessage // 优化element-ui Message弹窗: 有多个消息只弹出一个框
Vue.prototype.DOMPurify = DOMPurify // 防止XSS注入

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

// 自定义moment（js时间组件）
moment.locale('zh-cn', {
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY-MM-DD HH:mm:ss'
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1, // 星期一， 是一个星期的第一天
    doy: 4  // 1月4日所在的的一周是一年的第一周
  }
})
