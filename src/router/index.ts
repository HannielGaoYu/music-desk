import {createRouter, createWebHashHistory} from 'vue-router'


// import Login from '../views/login/login.vue'

const Login = () => import('../views/login/login.vue')
const Main = () => import('../views/main/main.vue')

const recommend = () => import('../views/main/c-views/recommend.vue')
const onlineExtract = () => import('../views/main/c-views/online-extract.vue')

const Play = () => import('../views/play/play.vue')

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: '/main'
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/main",
      component: Main,
      children: [
        {
          path: "/main",
          redirect: "/main/recommend"
        },
        {
          path: "/main/recommend",
          component: recommend
        },
        {
          path: "/main/online-extract",
          component: onlineExtract
        }
      ]
    },
    {
      path: "/play",
      component: Play
    }
  ]
})