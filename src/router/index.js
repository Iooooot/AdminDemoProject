import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/login/login.vue'
import Home from '../pages/home/home.vue'
import Welcome from '../pages/welcome.vue'
import Users from '../pages/user/Users.vue'
import Rights from '../pages/power/Rights.vue'
import Roles from '../pages/power/Roles.vue'
import Category from '../pages/goods/Category.vue'
import Params from '../pages/goods/Params.vue'
import GoodsList from '../pages/goods/List.vue'
import Add from '../pages/goods/Add.vue'


Vue.use(VueRouter)

export const constantRouterMap = [
  { path: '/login', component: Login },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
    ]
  }
]



export default new VueRouter({
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/users',//110
    component: Users,
    meta: { role: ['admin', '主管', '测试角色6'] }
  },
  {
    path: '/rights',//112
    component: Rights,
    meta: { role: ['admin', '主管', '测试角色', '测试角色5', '测试角色6'] }
  },
  {
    path: '/roles',//111
    component: Roles,
    meta: { role: ['admin', '主管', '测试角色', '测试角色5'] }
  }, {
    path: '/categories',//121
    component: Category,
    meta: { role: ['admin', '主管', '测试角色', '测试角色5'] }
  }, {
    path: '/params',//115
    component: Params,
    meta: { role: ['admin', '主管', '测试角色', '测试角色5'] }
  }
  , {
    path: '/goods',//104
    component: GoodsList,
    meta: { role: ['admin', '主管', '测试角色', '测试角色5', '角色3'] }
  },
  {
    path: '/goods/add',//105
    component: Add,
    meta: { role: ['admin', '主管', '测试角色', '测试角色2', '测试角色5', '角色3'] }
  },
];




