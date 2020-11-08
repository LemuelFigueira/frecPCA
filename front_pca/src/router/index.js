import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import UserHome from '../views/UserHome.vue'
import EventPage from '../views/EventPage.vue'
import GuestCheck from '../components/GuestCheck.vue'
import Invite from '../views/Invite.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  component: Login,
  meta: {
    requiresVisitor: true,
  }
}, {
  path: '/main',
  name: 'main',
  component: Home,
  meta: {
    requiresVisitor: true,
  }
},
{
  path: '*',
  redirect: '/main',
},
{
  path: '/home',
  name: 'home',
  component: UserHome,
  meta: {
    requiresAuth: true,
  }
},
{
  path: '/validate',
  name: 'validate',
  component: GuestCheck,
  meta: {
    requiresVisitor: true,
  }
},
{
  path: '/invite/:id',
  name: 'invite',
  component: Invite,
  meta: {
    requiresVisitor: true,
  }
  ,
},
{
  path: '/event/:id',
  name: 'EventPage',
  component: EventPage,
  meta: {
    requiresVisitor: true,
  }
},
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

function isAuthenticated() {
  return store.dispatch('fetchAccessToken')
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    isAuthenticated().then(() => {
      if (!store.state.userId) {
        next({
          name: 'login',
        })
      } else {
        next()
      }
    })
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    isAuthenticated().then(() => {
      if (store.state.userId) {
        next({

        })
      } else {
        next()
      }
    })
  }
})





export default router