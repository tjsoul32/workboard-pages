// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import echarts from 'echarts'
import App from './App'
import VueRouter from 'vue-router'
import store from './store'
import routes from './router'
import VueParticles from 'vue-particles'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueParticles)
Vue.component(CollapseTransition.name, CollapseTransition)
Vue.prototype.$echarts = echarts

NProgress.configure({ showSpinner: true })

const router = new VueRouter({
  routes
})

const whiteList = ['/login', '/authredirect']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.state.user.token) {
    if (to.path === '/login') {
      next(from.path)
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(route => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
