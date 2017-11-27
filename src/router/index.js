import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import TaskList from '@/views/TaskList'
import TaskStandalone from '@/views/TaskStandalone'
import TaskAgg from '@/views/TaskAgg'
import Login from '@/components/Login'
import Index from '@/views/Index'

import About from '@/views/About'

Vue.use(Router)

let routes = [
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: Login
  },
  {
    path: '/',
    name: '任务列表',
    component: Index,
    redirect: { name: 'TaskList' },
    children: [
      {
        path: '/tasklist',
        name: 'TaskList',
        component: TaskList
      },
      {
        path: '/taskstandalone/:id',
        name: 'TaskStandalone',
        hidden: true,
        component: TaskStandalone
      },
      {
        path: '/taskagg',
        name: 'TaskAgg',
        component: TaskAgg
      }
    ]
  },
  {
    path: '/',
    name: '其他',
    component: Index,
    children: [
      {
        path: '/about',
        name: '关于',
        component: About
      }
    ]
  }
]

export default routes
