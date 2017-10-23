import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import TaskList from '@/components/TaskList'
import TaskDetail from '@/components/TaskDetail'
import Login from '@/components/Login'
import Index from '@/components/Index'

Vue.use(Router)

let routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      {
        path: '/tasklist', // 任务列表
        name: 'TaskList',
        component: TaskList
      },
      {
        path: '/taskdetail/:taskid', // 任务详情
        name: 'TaskDetail',
        component: TaskDetail
      }
    ]
  }
]

export default routes
