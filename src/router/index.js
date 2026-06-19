import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import News from '../views/News.vue'
import Auth from '../views/Auth.vue'
import Calendar from '../views/Calendar.vue'
import Volunteers from '../views/Volunteers.vue'
import About from '../views/About.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/news',
      name: 'news',
      component: News
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar
    },
    {
      path: '/volunteers',
      name: 'volunteers',
      component: Volunteers
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})

export default router