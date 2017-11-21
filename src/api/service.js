import axios from 'axios'
import { Message } from 'element-ui'
import { getToken, getUsername } from '@/utils/auth'
import VueRouter from 'vue-router'
import store from '../store'
import routes from '../router'

const router = new VueRouter({
  routes
})

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000                  // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  const token = getToken()
  const un = getUsername()
  if (token) {
    config.headers['X-Token'] = token
  }
  if (un) {
    config.headers['X-Un'] = un
  }

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === -1) {
      store.dispatch('Logout').then(() => {
        router.push({ path: '/login' })
      })
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
