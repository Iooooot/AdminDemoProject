import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


//导入全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/';
axios.interceptors.request.use(config => {
  config.headers.Token = window.localStorage.getItem('token');
  return config
})
Vue.prototype.$http = axios;
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
Vue.use(ElementUI)


router.beforeEach((to, from, next) => {
  //登录页直接放行
  if (to.path == '/login') return next();
  let tokenStr = window.localStorage.getItem('token');
  if (!tokenStr) {
    return next('/login');
  } else {
    //还没有获取权限
    if (store.state.user.role == '') {
      store.dispatch('getRole').then(() => {
        store.dispatch('generateRoutes', store.state.user.role).then(() => { // 生成可访问的路由表
          router.addRoutes(store.state.permission.addRouters) // 动态添加可访问路由表
          next({ ...to, replace: true })
        })
      })
    } else {
      next();
    }
  }
})

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
